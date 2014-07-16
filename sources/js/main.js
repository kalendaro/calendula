var Calendula = function(data) {
    data = extend({}, data || {});
    
    var current = new Date(),
        obj = this,
        years = this._prepareYears(data.years),
        data = extend(data, {
            autoclose: typeof data.autoclose === 'undefined' ? true : data.autoclose,
            lang: data.lang || Calendula._defaultLang,
            onselect: data.onselect || function(e, value) {},
            theme: data.theme || 'default',
            _startYear: years.start,
            _endYear: years.end
        });

    obj._data = data;
    
    this.val(this._data.value);
};

extend(Calendula.prototype, {
    isOpened: function() {
        return this._isOpened;
    },
    open: function() {
        var that = this;
        
        this._init();
        
        this._ignoreDocumentClick = true;
        
        if(!this.isOpened()) {
            // For Firefox CSS3 animation
            Timeout.set(function() {
                that._container.classList.add(mod('opened'));
                that._update();
                that._monthSelector(that._currentDate.month, false);
                that._yearSelector(that._currentDate.year, false);
                that._openedEvents();
            }, 1, 'open');
            
            this._isOpened = true;
        }
        
        return this;
    },
    close: function() {
        this._init();
        
        if(this.isOpened()) {
            this._ignoreDocumentClick = false;
            
            Timeout.clearAll('open');
            
            this._update();
            this._container.classList.remove(mod('opened'));
            
            this._delOpenedEvents();
            this._isOpened = false;
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
        var date;
        
        if(!arguments.length) {
            return this._val;
        }
        
        if(value) {
            if(typeof value === 'string') {
                date = Date.parse(value);
            } else if(typeof value === 'object') {
                if(value instanceof Date) {
                    date = value;
                } else {
                    date = new Date(value.year, value.month, value.day, 12, 0, 0, 0);
                }
            } else if(typeof number === 'number') {
                date = new Date(value);
            }
            
            this._val = {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear()
            };
            
            this._currentDate = extend({}, this._val);
        } else {
            this._val = {};
            this._currentDate = this._current();
        }
    },
    setting: function(name, value) {
        if(arguments.length === 1) {
            return this._data[name];
        }
        
        var oldValue = this._data[name],
            container = this._container;
        
        this._data[name] = value;
        
        if(container) {
            if(name === 'theme') {
                container.classList.remove(mod('theme', oldValue));
                container.classList.add(mod('theme', value));
            }
            
            if(name === 'lang') {
                this._rebuild();
            }
        }
        
        return this;
    },
    destroy: function() {
        if(this._isInited) {
            this.close();
            
            Timeout.clearAll();
            
            this._events.offAll();
            
            document.body.removeChild(this._container);
            
            ['_isInited', '_container', '_isOpened', '_ignoreDocumentClick', '_data'].forEach(function(el) {
                delete this[el];
            }, this);
        }
    },
    _init: function() {
        if(this._isInited) {
            return;
        }
        
        this._templates.parent = this;
        
        this._isInited = true;
        
        var that = this,
            button = this.setting('button'),
            container = document.createElement('div');
            
        this._container = container;

        container.classList.add(NS);
        container.classList.add(mod('theme', this._data.theme));
        
        if(button) {
            this._events.on(button, 'click', function() {
                that.toggle();
            }, 'init');
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
        this._elem('days-container').innerHTML = this._templates.prepare(this._templates.days(this._currentDate.year));
        this._monthSelector(this._currentDate.month, false);
    },
    _openedEvents: function() {
        var that = this;
        
        this._ignoreDocumentClick = false;
        
        this._events.on(document, 'click', function(e) {
            if(e.button || !that.setting('autoclose')) {
                return;
            }
            
            if(that._ignoreDocumentClick) {
                that._ignoreDocumentClick = false;
            } else {
                that.close();
            }
        }, 'open');
        
        this._events.on(window, 'resize', function() {
            that._resize();
        }, 'open');
        
        this._events.on(document, 'keypress', function(e) {
            if(e.keyCode === 27) { // ESC
                that.close();
            }
        }, 'open');
        
        this._events.on(this._container, 'click', function(e) {
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
        
        this._events.onWheel(days, this._onwheelmonths, 'open');
        this._events.onWheel(months, this._onwheelmonths, 'open');
        this._events.onWheel(years, this._onwheelyears, 'open');
        
        this._events.on(months, 'click', function(e) {
            if(e.button) {
                return;
            }

            if(e.target.classList.contains(elem('month'))) {
                that._monthSelector(+dataAttr(e.target, 'month'), true);
            }
        }, 'open');
        
        this._events.on(years, 'click', function(e) {
            if(e.button) {
                return;
            }
            
            var y = dataAttr(e.target, 'year');
            if(y) {
                that._yearSelector(+y, true);
            }
        }, 'open');
        
        this._events.on(days, 'click', function(e) {
            if(e.button) {
                return;
            }

            var cl = elem('day', 'selected'),
                cd = that._currentDate,
                target = e.target,
                day = dataAttr(target, 'day'),
                month = dataAttr(target, 'month');
                
            if(day && !target.classList.contains(cl)) {
                cd.day = +day;
                cd.month = +month;
                
                var selected = days.querySelector('.' + cl);
                if(selected) {
                    selected.classList.remove(cl);
                }
                
                target.classList.add(cl);
                
                that.setting('onselect')({
                    type: 'select'
                }, {
                    day: cd.day,
                    month: cd.month,
                    year: cd.year
                });
                
                that.close();
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
            selector = this._elem('month-selector'),
            daysContainer = this._elem('days-container'),
            days = this._elem('days'),
            daysContainerTop,
            noAnimDays = elem('days', 'noanim'),
            noAnimMonths = elem('months', 'noanim');
            
        if(!anim) {
            days.classList.add(noAnimDays);
            months.classList.add(noAnimMonths);
        }
        
        var top = Math.floor(this._currentDate.month * monthHeight - (monthHeight / 2));
        if(top <= 0) {
            top = 1;
        }
        
        if(top + selector.offsetHeight >= months.offsetHeight) {
            top = months.offsetHeight - selector.offsetHeight - 1;
        }
        
        this._top(selector, top);
        
        daysContainerTop = -Math.floor(monthsElems[month].offsetTop - days.offsetHeight / 2 + monthsElems[month].offsetHeight / 2);
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
            Timeout.set(function() {
                days.classList.remove(noAnimDays);
                months.classList.remove(noAnimMonths);
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
            startYear = this._data._startYear,
            endYear = this._data._endYear,
            noAnim = elem('years', 'noanim');
            
        if(!anim) {
            years.classList.add(noAnim);
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
            Timeout.set(function() {
                years.classList.remove(noAnim);
            }, 0, 'anim');
        }
    },
    _colorizeMonths: function(month) {
        var months = this._elemAll('month'),
            MAX_COLOR = 5;
        for(var c = 0; c < MAX_COLOR; c++) {
            var elems = this._elemAll('month', 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                elems[i].classList.remove(elem('month', 'color', c));
            }
        }
        
        var cl0 = elem('month', 'color', '0');
        months[month].classList.add(cl0);
        
        if(month - 1 >= MIN_MONTH) {
            months[month - 1].classList.add(cl0);
        }
        
        if(month + 1 <= MAX_MONTH) {
            months[month + 1].classList.add(cl0);
        }
        
        var n = 1;
        for(c = month - 2; c >= MIN_MONTH && n < MAX_COLOR; c--, n++) {
            months[c].classList.add(elem('month', 'color', n));
        }
        
        n = 1;
        for(c = month + 2; c <= MAX_MONTH && n < MAX_COLOR; c++, n++) {
            months[c].classList.add(elem('month', 'color', n));
        }
    },
    _colorizeYears: function(year) {
        var years = this._elemAll('year'),
            startYear = this._data._startYear,
            MAX_COLOR = 5;
        for(var c = 0; c < MAX_COLOR; c++) {
            var elems = this._elemAll('year', 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                elems[i].classList.remove(elem('year', 'color', c));
            }
        }
        
        years[year - startYear].classList.add(elem('year', 'color', '0'));
        
        var n = 1;
        for(c = year - 1; c >= this._data._startYear && n < MAX_COLOR; c--, n++) {
            years[c - startYear].classList.add(elem('year', 'color', n));
        }
        
        n = 1;
        for(c = year + 1; c <= this._data.endYear && n < MAX_COLOR; c++, n++) {
            years[c - startYear].classList.add(elem('year', 'color', n));
        }
    },
    _delOpenedEvents: function() {
        this._events.offAll('open');
    },
    _prepareYears: function(y) {
        var current = this._current(),
            buf,
            startYear,
            endYear;
        
        if(typeof y === 'string') {
            buf = y.trim().split(/[:,; ]/);
            startYear = parseInt(buf[0], 10);
            endYear = parseInt(buf[1], 10);
            
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
    _buttonText: function() {
        var date = this._currentDate,
            m = this.text('months'),
            cm = this.text('caseMonths');
            
        return date.day + ' ' + (cm || m)[date.month] + ' ' + date.year;
    }
});
