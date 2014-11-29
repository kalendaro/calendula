var NS = 'calendula',
    MIN_MONTH = 0,
    MAX_MONTH = 11;

function extend(container, obj) {
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            container[i] = obj[i];
        }
    }

    return container;
}

var Cln = function(data) {
    data = extend({}, data || {});

    var years = this._prepareYears(data.years),
        d = extend(data, {
            autocloseable: isUndefined(data.autocloseable) ? true : data.autocloseable,
            closeAfterSelection: isUndefined(data.closeAfterSelection) ? true : data.closeAfterSelection,
            locale: data.locale || Cln._defaultLocale,
            min: this._parseDateToObj(data.min),
            max: this._parseDateToObj(data.max),
            showOn: data.showOn || 'click',
            theme: data.theme || 'default',
            _startYear: years.start,
            _endYear: years.end
        });

    this._data = d;

    this._initExts([
        ['event', Event],
        ['domEvent', DomEvent],
        ['template', Template],
        ['timeout', Timeout],
        ['title', Title],
        ['tooltip', Tooltip]
    ]);

    this.val(d.value);

    this._addSwitcherEvents(d.showOn);
};

Cln.version = '0.9.9';

extend(Cln.prototype, {
    isOpened: function() {
        return this._isOpened;
    },
    open: function() {
        var that = this;

        this._init();

        if(!this.isOpened()) {
            this.timeout
                .clearAll(['open', 'close'])
                .set(function() {
                    setMod(that._container, 'opened');
                    that._update();
                    that._monthSelector(that._currentDate.month, false);
                    that._yearSelector(that._currentDate.year, false);
                    that._openedEvents();
                }, 0, 'open');

            this._isOpened = true;

            this.event.trigger('open');
        }

        return this;
    },
    close: function() {
        var that = this;
        this._init();

        if(this.isOpened()) {
            that.timeout
                .clearAll(['open', 'close'])
                .set(function() {
                    that._isOpened = false;

                    that.timeout.clearAll('open');

                    that._update();

                    that._delOpenedEvents();

                    delMod(that._container, 'opened');

                    that.tooltip.hide();

                    that.event.trigger('close');
                }, 0, 'close');
        }

        return this;
    },
    toggle: function() {
        return this.isOpened() ? this.close() : this.open();
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

        this._updateSwitcher();
    },
    setting: function(name, value) {
        var d = this._data,
            container = this._container,
            rebuild = {
                min: true,
                max: true,
                locale: true
            };

        if(arguments.length === 1) {
            return d[name];
        }

        if(name === 'min' || name === 'max' || name === 'value') {
            d[name] = this._parseDateToObj(value);
        } else {
            d[name] = value;
        }

        if(name === 'showOn') {
            this._addSwitcherEvents(value);
        }

        if(container) {
            if(name === 'theme') {
                setMod(container, 'theme', value);
            }

            if(name === 'daysAfterMonths') {
                if(value) {
                    setMod(container, 'days-after-months');
                } else {
                    delMod(container, 'days-after-months');
                }
            }

            if(rebuild[name]) {
                this._rebuild();
            }
        }

        return this;
    },
    position: function() {
        var pos = this.setting('position') || 'left bottom',
            switcher = this.setting('switcher'),
            p = getOffset(switcher),
            buf, x, y,
            con = this._container,
            conWidth = con.offsetWidth,
            conHeight = con.offsetHeight,
            switcherWidth = switcher.offsetWidth,
            switcherHeight = switcher.offsetHeight;

        if(isString(pos)) {
            buf = pos.trim().split(/ +/);
            x = p.left;
            y = p.top;

            switch(buf[0]) {
                case 'center':
                    x += -(conWidth - switcherWidth) / 2;
                break;
                case 'right':
                    x += switcherWidth - conWidth;
                break;
            }

            switch(buf[1]) {
                case 'top':
                    y += -conHeight;
                break;
                case 'center':
                    y += -(conHeight - switcherHeight) / 2;
                break;
                case 'bottom':
                    y += switcherHeight;
                break;
            }
        } else {
            x = p.left;
            y = p.top;
        }

        setPosition(this._container, x, y);
    },
    destroy: function() {
        if(this._isInited) {
            this.close();

            this._removeExts();

            document.body.removeChild(this._container);

            [
                '_container',
                '_data',
                '_isInited',
                '_isOpened'
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

        var id = this.setting('id'),
            container = document.createElement('div');

        this._container = container;

        if(id) {
            container.id = id;
        }

        addClass(container, NS);
        setMod(container, 'theme', this._data.theme);

        if(this.setting('daysAfterMonths')) {
            setMod(container, 'days-after-months');
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

        if(this.setting('switcher')) {
            this.position();
        }
    },
    _findDayByDate: function(date) {
        if(date.year !== this._currentDate.year) {
            return null;
        }

        var month = this._elemAll('days-month')[date.month];
        if(month) {
            var day = this._elemAllContext(month, 'day')[date.day - 1];
            return day || null;
        }

        return null;
    },
    _resize: function() {
        this._update();
    },
    _rebuild: function() {
        this._container.innerHTML = this.template.get('main');
    },
    _rebuildDays: function() {
        this._elem('days-container').innerHTML = this.template.get('days');
        this._monthSelector(this._currentDate.month, false);
    },
    _intoContainer: function(target) {
        var node = target;

        while(node) {
            if(node === this._container) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    },
    _openedEvents: function() {
        var that = this;

        this.domEvent.on(document, 'click', function(e) {
            if(e.button || !that.setting('autocloseable')) {
                return;
            }

            if(e.target !== that.setting('switcher') && !that._intoContainer(e.target)) {
                that.close();
            }
        }, 'open');

        this.domEvent
            .on(window, 'resize', function() {
                that._resize();
            }, 'open')
            .on(document, 'keypress', function(e) {
                if(e.keyCode === 27) { // ESC
                    that.close();
                }
            }, 'open')
            .on(this._container, 'click', function(e) {
                if(e.button) {
                    return;
                }

                that.tooltip.hide();
            }, 'open');

        var days = this._elem('days'),
            months = this._elem('months'),
            years = this._elem('years'),
            getK = function(e) {
                var k = 0;
                if(e.deltaY > 0) {
                    k = 1;
                } else if(e.deltaY < 0) {
                    k = -1;
                }

                return k;
            };

        this._onwheelmonths = function(e) {
            var k = getK(e);
            if(k) {
                that._monthSelector(that._currentDate.month + k, true);
                e.preventDefault();
            }
        };

        this._onwheelyears = function(e) {
            var k = getK(e);
            if(k) {
                that._yearSelector(that._currentDate.year + k, true);
                e.preventDefault();
            }
        };

        this.domEvent
            .onWheel(days, this._onwheelmonths, 'open')
            .onWheel(months, this._onwheelmonths, 'open')
            .onWheel(years, this._onwheelyears, 'open');

        this.domEvent.on(months, 'click', function(e) {
            if(e.button) {
                return;
            }

            if(hasElem(e.target, 'month')) {
                that._monthSelector(+dataAttr(e.target, 'month'), true);
            }
        }, 'open');

        this.domEvent.on(years, 'click', function(e) {
            if(e.button) {
                return;
            }

            var y = dataAttr(e.target, 'year');
            if(y) {
                that._yearSelector(+y, true);
            }
        }, 'open');

        this.domEvent.on(days, 'mouseover', function(e) {
            var target = e.target,
                d = +dataAttr(target, 'day'),
                m = +dataAttr(target, 'month'),
                y = +that._currentDate.year;

            if(hasElem(target, 'day') && hasMod(target, 'has-title')) {
                that.tooltip.show(target, that.title.get(that._ymdToISO(y, m, d)));
            }
        }, 'open');

        this.domEvent.on(days, 'mouseout', function(e) {
            if(hasElem(e.target, 'day')) {
                that.tooltip.hide();
            }
        }, 'open');

        this.domEvent.on(days, 'click', function(e) {
            if(e.button) {
                return;
            }

            var cd = that._currentDate,
                target = e.target,
                day = dataAttr(target, 'day'),
                month = dataAttr(target, 'month');

            if(day) {
                if(hasMod(target, 'minmax')) {
                    return;
                }

                if(!hasMod(target, 'selected')) {
                    cd.day = +day;
                    cd.month = +month;

                    var selected = days.querySelector('.' + elem('day', 'selected'));
                    if(selected) {
                        delMod(selected, 'selected');
                    }

                    setMod(target, 'selected');

                    that.event.trigger('select', {
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
            daysContainerTop;

        if(!anim) {
            setMod(days, 'noanim');
            setMod(months, 'noanim');
        }

        var top = Math.floor(this._currentDate.month * monthHeight - monthHeight / 2);
        if(top <= 0) {
            top = 1;
        }

        if(top + selector.offsetHeight >= months.offsetHeight) {
            top = months.offsetHeight - selector.offsetHeight - 1;
        }

        setTranslateY(selector, top);

        daysContainerTop = -Math.floor(monthElem.offsetTop - days.offsetHeight / 2 + monthElem.offsetHeight / 2);
        if(daysContainerTop > 0) {
            daysContainerTop = 0;
        }

        var deltaHeight = days.offsetHeight - daysContainer.offsetHeight;
        if(daysContainerTop < deltaHeight) {
            daysContainerTop = deltaHeight;
        }

        setTranslateY(daysContainer, daysContainerTop);

        this._colorizeMonths(month);

        if(!anim) {
            this.timeout.set(function() {
                delMod(days, 'noanim');
                delMod(months, 'noanim');
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
            selector = this._elem('year-selector');

        if(!anim) {
            setMod(years, 'noanim');
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

        setTranslateY(selector, topSelector);
        setTranslateY(yearsContainer, topContainer);

        this._colorizeYears(year);

        if(!anim) {
            this.timeout.set(function() {
                delMod(years, 'noanim');
            }, 0, 'anim');
        }
    },
    _colorizeMonths: function(month) {
        var months = this._elemAll('month'),
            MAX_COLOR = 5;
        for(var c = 0; c < MAX_COLOR; c++) {
            var elems = this._elemAll('month', 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                delMod(elems[i], 'color', c);
            }
        }

        setMod(months[month], 'color', '0');

        if(month - 1 >= MIN_MONTH) {
            setMod(months[month - 1], 'color', '0');
        }

        if(month + 1 <= MAX_MONTH) {
            setMod(months[month + 1], 'color', '0');
        }

        var n = 1;
        for(c = month - 2; c >= MIN_MONTH && n < MAX_COLOR; c--, n++) {
            setMod(months[c], 'color', n);
        }

        n = 1;
        for(c = month + 2; c <= MAX_MONTH && n < MAX_COLOR; c++, n++) {
            setMod(months[c], 'color', n);
        }
    },
    _colorizeYears: function(year) {
        var years = this._elemAll('year'),
            startYear = this._data._startYear,
            MAX_COLOR = 5;
        for(var c = 0; c < MAX_COLOR; c++) {
            var elems = this._elemAll('year', 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                delMod(elems[i], 'color', c);
            }
        }

        setMod(years[year - startYear], 'color', '0');

        var n = 1;
        for(c = year - 1; c >= this._data._startYear && n < MAX_COLOR; c--, n++) {
            setMod(years[c - startYear], 'color', n);
        }

        n = 1;
        for(c = year + 1; c <= this._data._endYear && n < MAX_COLOR; c++, n++) {
            setMod(years[c - startYear], 'color', n);
        }
    },
    _delOpenedEvents: function() {
        this.domEvent.offAll('open');
    },
    _prepareYears: function(y) {
        var current = this._current(),
            buf,
            startYear,
            endYear;

        if(isString(y)) {
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
        var elSelected = this._elem('day', 'selected');
        if(elSelected) {
            delMod(elSelected, 'selected');
        }

        if(this._currentDate.year === this._val.year) {
            var months = this._elemAll('days-month');
            if(months && months[this._val.month]) {
                var el = this._elemAllContext(months[this._val.month], 'day'),
                    d = this._val.day - 1;

                if(el && el[d]) {
                    setMod(el[d], 'selected');
                }
            }
        }
    },
    _addSwitcherEvents: function(showOn) {
        var switcher = this.setting('switcher'),
            that = this,
            events = isArray(showOn) ? showOn : [showOn || 'click'],
            openedTagNames = ['input', 'textarea'],
            openedEvents = ['focus', 'mouseover'];

        this.domEvent.offAll('switcher');

        if(events.indexOf('none') !== -1) {
            return;
        }

        if(switcher) {
            var tagName = switcher.tagName.toLowerCase();
            events.forEach(function(el) {
                that.domEvent.on(switcher, el, function() {
                    if(openedTagNames.indexOf(tagName) !== -1 || openedEvents.indexOf(el) !== -1) {
                        that.open();
                    } else {
                        that.toggle();
                    }
                }, 'switcher');
            });
        }
    },
    _updateSwitcher: function() {
        var el = this.setting('switcher'),
            text = this._switcherText(),
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
    _switcherText: function() {
        var date = this._currentDate,
            m = this.text('months'),
            cm = this.text('caseMonths');

        return date.day + ' ' + (cm || m)[date.month] + ' ' + date.year;
    }
});
