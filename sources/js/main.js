var Cln = function(data) {
    data = extend({}, data || {});
    
    var years = this._prepareYears(data.years),
        that = this;
        
    this._data = extend(data, {
        autoclose: typeof data.autoclose === 'undefined' ? true : data.autoclose,
        closeAfterSelection: typeof data.closeAfterSelection === 'undefined' ? true : data.closeAfterSelection,
        locale: data.locale || Cln._defaultLocale,
        theme: data.theme || 'default',
        min: this._parseDateToObj(data.min),
        max: this._parseDateToObj(data.max),
        _startYear: years.start,
        _endYear: years.end
    });
    
    this._domEvent = new DomEvent();
    
    this.val(this._data.value);

    var button = this.setting('button');
    if(button) {
        this._domEvent.on(button, 'click', function() {
            that.toggle();
        }, 'init');
    }
};

Cln.version = '0.9.0';

extend(Cln.prototype, {
    isOpened: function() {
        return this._isOpened;
    },
    open: function() {
        var that = this;
        
        this._init();
        
        this._ignoreDocumentClick = true;
        
        if(!this.isOpened()) {
            // For Firefox CSS3 animation
            this._timeout.set(function() {
                addClass(that._container, mod('opened'));
                that._update();
                that._monthSelector(that._currentDate.month, false);
                that._yearSelector(that._currentDate.year, false);
                that._openedEvents();
            }, 1, 'open');
            
            this._isOpened = true;
            
            this.trigger('open');
        }
        
        return this;
    },
    close: function() {
        this._init();
        
        if(this.isOpened()) {
            this._ignoreDocumentClick = false;

            this._timeout.clearAll('open');
            
            this._update();

            this._delOpenedEvents();

            removeClass(this._container, mod('opened'));

            this._isOpened = false;
            
            this.trigger('close');
        }
        
        return this;
    },
    toggle: function() {
        if(this.isOpened()) {
            this.close();
        } else {
            this.open();
        }
        
        return this;
    },
    val: function(value) {
        if(!arguments.length) {
            return this._val;
        }
        
        if(value) {
            this._val = this._parseDateToObj(value);
            this._currentDate = extend({}, this._val);
        } else {
            this._val = {};
            this._currentDate = this._current();
        }
        
        if(this._container) {
            this._updateSelection();
        }
        
        this._updateButton();
    },
    setting: function(name, value) {
        if(arguments.length === 1) {
            return this._data[name];
        }
        
        var oldValue = this._data[name],
            container = this._container,
            m,
            rebuild = {
                min: true,
                max: true,
                locale: true
            };
        
        if(name === 'min' || name === 'max' || name === 'value') {
            this._data[name] = this._parseDateToObj(value);
        } else {
            this._data[name] = value;
        }
        
        if(container) {
            if(name === 'theme') {
                removeClass(container, mod('theme', oldValue));
                addClass(container, mod('theme', value));
            }
            
            if(name === 'daysAfterMonths') {
                m = mod('days-after-months');
                if(value) {
                    addClass(container, m);
                } else {
                    removeClass(container, m);
                }
            }
            
            if(rebuild[name]) {
                this._rebuild();
            }
        }
        
        return this;
    },
    destroy: function() {
        if(this._isInited) {
            this.close();
            
            this._timeout.clearAll();
            
            this._eventBuf = [];
            this._domEvent.offAll();
            
            document.body.removeChild(this._container);
            
            [
                '_container',
                '_data',
                '_domEvent',
                '_ignoreDocumentClick',
                '_isInited',
                '_isOpened',
                '_timeout'
            ].forEach(function(el) {
                delete this[el];
            }, this);
        }
    },
    _init: function() {
        if(this._isInited) {
            return;
        }
        
        this._isInited = true;

        this._timeout = new Timeout();

        this._templates.parent = this;
                
        var id = this.setting('id'),
            container = document.createElement('div');
            
        this._container = container;

        if(id) {
            container.id = id;
        }
        
        addClass(container, NS);
        addClass(container, mod('theme', this._data.theme));
        
        if(this.setting('daysAfterMonths')) {
            addClass(container, mod('days-after-months'));
        }
        
        this._rebuild();

        document.body.appendChild(container);
    },
    _current: function() {
        var d = new Date();
        
        return {
            day: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear()
        };
    },
    _update: function() {
        this._init();
        
        var button = this.setting('button'),
            offset;
        if(button) {
            offset = this._offset(button);
            offset.top += button.offsetHeight;
            this._position(this._container, offset);
        }
    },
    _resize: function() {
        this._update();
    },
    _rebuild: function() {
        this._container.innerHTML = this.template('main');
    },
    _rebuildDays: function() {
        this._elem('days-container').innerHTML = this.template('days');
        this._monthSelector(this._currentDate.month, false);
    },
    _openedEvents: function() {
        var that = this;
        
        this._ignoreDocumentClick = false;
        
        this._domEvent.on(document, 'click', function(e) {
            if(e.button || !that.setting('autoclose')) {
                return;
            }
            
            if(that._ignoreDocumentClick) {
                that._ignoreDocumentClick = false;
            } else {
                that.close();
            }
        }, 'open');
        
        this._domEvent.on(window, 'resize', function() {
            that._resize();
        }, 'open');
        
        this._domEvent.on(document, 'keypress', function(e) {
            if(e.keyCode === 27) { // ESC
                that.close();
            }
        }, 'open');
        
        this._domEvent.on(this._container, 'click', function(e) {
            if(e.button) {
                return;
            }
            
            that._ignoreDocumentClick = true;
        }, 'open');
        
        var days = this._elem('days'),
            months = this._elem('months'),
            years = this._elem('years');
        
        this._onwheelmonths = function(e) {
            var k = 0;
            if(e.deltaY > 0) {
                k = 1;
            } else if(e.deltaY < 0) {
                k = -1;
            }
            
            if(k) {
                that._monthSelector(that._currentDate.month + k, true);
                e.preventDefault();
            }
        };
        
        this._onwheelyears = function(e) {
            var k = 0;
            if(e.deltaY > 0) {
                k = 1;
            } else if(e.deltaY < 0) {
                k = -1;
            }
            
            if(k) {
                that._yearSelector(that._currentDate.year + k, true);
                e.preventDefault();
            }
        };
        
        this._domEvent.onWheel(days, this._onwheelmonths, 'open');
        this._domEvent.onWheel(months, this._onwheelmonths, 'open');
        this._domEvent.onWheel(years, this._onwheelyears, 'open');
        
        this._domEvent.on(months, 'click', function(e) {
            if(e.button) {
                return;
            }

            if(hasClass(e.target, elem('month'))) {
                that._monthSelector(+dataAttr(e.target, 'month'), true);
            }
        }, 'open');
        
        this._domEvent.on(years, 'click', function(e) {
            if(e.button) {
                return;
            }
            
            var y = dataAttr(e.target, 'year');
            if(y) {
                that._yearSelector(+y, true);
            }
        }, 'open');
        
        this._domEvent.on(days, 'click', function(e) {
            if(e.button) {
                return;
            }

            var cl = elem('day', 'selected'),
                cd = that._currentDate,
                target = e.target,
                day = dataAttr(target, 'day'),
                month = dataAttr(target, 'month');
            
            
                
            if(day) {
                if(hasClass(target, elem('day', 'minmax'))) {
                    return;
                }
                
                if(!hasClass(target, cl)) {
                    cd.day = +day;
                    cd.month = +month;
                    
                    var selected = days.querySelector('.' + cl);
                    if(selected) {
                        removeClass(selected, cl);
                    }
                    
                    addClass(target, cl);
                    
                    that.trigger('select', {
                        day: cd.day,
                        month: cd.month,
                        year: cd.year
                    });
                    
                    if(that.setting('closeAfterSelection')) {
                        that.close();
                    }
                }
            }
        }, 'open');
    },
    _monthSelector: function(month, anim) {
        if(month < MIN_MONTH) {
            month = MIN_MONTH;
        } else if(month > MAX_MONTH) {
            month = MAX_MONTH;
        }
        
        this._currentDate.month = month;
        
        var months = this._elem('months'),
            monthHeight = this._elem('month').offsetHeight,
            monthsElems = this._elemAll('days-month'),
            monthElem = monthsElems[month],
            selector = this._elem('month-selector'),
            daysContainer = this._elem('days-container'),
            days = this._elem('days'),
            daysContainerTop,
            noAnimDays = elem('days', 'noanim'),
            noAnimMonths = elem('months', 'noanim');
            
        if(!anim) {
            addClass(days, noAnimDays);
            addClass(months, noAnimMonths);
        }
        
        var top = Math.floor(this._currentDate.month * monthHeight - monthHeight / 2);
        if(top <= 0) {
            top = 1;
        }
        
        if(top + selector.offsetHeight >= months.offsetHeight) {
            top = months.offsetHeight - selector.offsetHeight - 1;
        }
        
        this._top(selector, top);
        
        daysContainerTop = -Math.floor(monthElem.offsetTop - days.offsetHeight / 2 + monthElem.offsetHeight / 2);
        if(daysContainerTop > 0) {
            daysContainerTop = 0;
        }
        
        var deltaHeight = days.offsetHeight - daysContainer.offsetHeight;
        if(daysContainerTop < deltaHeight) {
            daysContainerTop = deltaHeight;
        }
        
        this._top(daysContainer, daysContainerTop);
        
        this._colorizeMonths(month);
        
        if(!anim) {
            this._timeout.set(function() {
                removeClass(days, noAnimDays);
                removeClass(months, noAnimMonths);
            }, 0, 'anim');
        }
    },
    _yearSelector: function(year, anim) {
        var d = this._data,
            startYear = d._startYear,
            endYear = d._endYear,
            oldYear = this._currentDate.year;
            
        if(year < startYear) {
            year = startYear;
        } else if(year > endYear) {
            year = endYear;
        }
        
        this._currentDate.year = year;
        
        var years = this._elem('years'),
            yearsContainer = this._elem('years-container'),
            yearHeight = this._elem('year').offsetHeight,
            selector = this._elem('year-selector'),
            noAnim = elem('years', 'noanim');
            
        if(!anim) {
            addClass(years, noAnim);
        }
        
        var topSelector = Math.floor((this._currentDate.year - startYear) * yearHeight),
            topContainer = -Math.floor((this._currentDate.year - startYear) * yearHeight - years.offsetHeight / 2);
            
        if(topContainer > 0) {
            topContainer = 0;
        }
        
        if(topContainer < years.offsetHeight - yearsContainer.offsetHeight) {
            topContainer = years.offsetHeight - yearsContainer.offsetHeight;
        }
        
        var k = 0;
        if(years.offsetHeight >= yearsContainer.offsetHeight) {
            if((endYear - startYear + 1) % 2) {
                k = yearHeight;
            }
            
            topContainer = Math.floor((years.offsetHeight - yearsContainer.offsetHeight - k) / 2);
        }
        
        if(year !== oldYear) {
            this._rebuildDays(year);
        }
        
        this._top(selector, topSelector);
        this._top(yearsContainer, topContainer);
        
        this._colorizeYears(year);
        
        if(!anim) {
            this._timeout.set(function() {
                removeClass(years, noAnim);
            }, 0, 'anim');
        }
    },
    _colorizeMonths: function(month) {
        var months = this._elemAll('month'),
            MAX_COLOR = 5;
        for(var c = 0; c < MAX_COLOR; c++) {
            var elems = this._elemAll('month', 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                removeClass(elems[i], elem('month', 'color', c));
            }
        }
        
        var cl0 = elem('month', 'color', '0');
        addClass(months[month], cl0);
        
        if(month - 1 >= MIN_MONTH) {
            addClass(months[month - 1], cl0);
        }
        
        if(month + 1 <= MAX_MONTH) {
            addClass(months[month + 1], cl0);
        }
        
        var n = 1;
        for(c = month - 2; c >= MIN_MONTH && n < MAX_COLOR; c--, n++) {
            addClass(months[c], elem('month', 'color', n));
        }
        
        n = 1;
        for(c = month + 2; c <= MAX_MONTH && n < MAX_COLOR; c++, n++) {
            addClass(months[c], elem('month', 'color', n));
        }
    },
    _colorizeYears: function(year) {
        var years = this._elemAll('year'),
            startYear = this._data._startYear,
            MAX_COLOR = 5;
        for(var c = 0; c < MAX_COLOR; c++) {
            var elems = this._elemAll('year', 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                removeClass(elems[i], elem('year', 'color', c));
            }
        }
        
        addClass(years[year - startYear], elem('year', 'color', '0'));
        
        var n = 1;
        for(c = year - 1; c >= this._data._startYear && n < MAX_COLOR; c--, n++) {
            addClass(years[c - startYear], elem('year', 'color', n));
        }
        
        n = 1;
        for(c = year + 1; c <= this._data._endYear && n < MAX_COLOR; c++, n++) {
            addClass(years[c - startYear], elem('year', 'color', n));
        }
    },
    _delOpenedEvents: function() {
        this._domEvent.offAll('open');
    },
    _prepareYears: function(y) {
        var current = this._current(),
            buf,
            startYear,
            endYear;
        
        if(typeof y === 'string') {
            buf = y.trim().split(/[:,; ]/);
            startYear = parseNum(buf[0]);
            endYear = parseNum(buf[1]);
            
            if(!isNaN(startYear) && !isNaN(endYear)) {
                if(Math.abs(startYear) < 1000) {
                    startYear = current.year + startYear;
                }
                
                if(Math.abs(endYear) < 1000) {
                    endYear = current.year + endYear;
                }
            }
        }
        
        return {
            start: startYear || (current.year - 11),
            end: endYear || (current.year + 1)
        };
    },
    _updateSelection: function() {
        var el = this._elem('day', 'selected'),
            months;
       
        if(el) {
            removeClass(el, elem('day', 'selected'));
        }
        
        if(this._currentDate.year === this._val.year) {
            months = this._elemAll('days-month');
            if(months && months[this._val.month]) {
                el = this._elemAllContext(months[this._val.month], 'day');
                if(el && el[this._val.day - 1]) {
                    addClass(el[this._val.day - 1], elem('day', 'selected'));
                }
            }
        }
    },
    _updateButton: function() {
        var el = this.setting('button'),
            text = this._buttonText(),
            tagName;
            
        if(el) {
            tagName = el.tagName.toLowerCase();
            if(tagName === 'input' || tagName === 'textarea') {
                el.value = text;
            } else {
                el.innerHTML = text;
            }
        }
    },
    _buttonText: function() {
        var date = this._currentDate,
            m = this.text('months'),
            cm = this.text('caseMonths');
            
        return date.day + ' ' + (cm || m)[date.month] + ' ' + date.year;
    }
});
