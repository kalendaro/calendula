/*! Calendula | © 2016 Denis Seleznev | https://github.com/hcodes/calendula/ */

(function(window, document, Date, Math, undefined) {

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define('calendula', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Calendula = factory();
    }
}(this, function() {
    'use strict';

var MIN_MONTH = 0,
    MAX_MONTH = 11;

function extend(dest, source) {
    for(var i in source) {
        if(source.hasOwnProperty(i)) {
            dest[i] = source[i];
        }
    }

    return dest;
}

var Cln = function(data) {
    data = extend({}, data || {});

    var years = this._prepareYears(data.years),
        d = extend(data, {
            autocloseable: isUndefined(data.autocloseable) ? true : data.autocloseable,
            closeAfterSelection: isUndefined(data.closeAfterSelection) ? true : data.closeAfterSelection,
            locale: data.locale || Cln._defaultLocale,
            max: parseDateToObj(data.max),
            min: parseDateToObj(data.min),
            showOn: data.showOn || 'click',
            theme: data.theme || 'default',
            _startYear: years.start,
            _endYear: years.end
        });

    this._data = d;

    this._initExts();

    this.val(d.value);

    this._addSwitcherEvents(d.showOn);
};

extend(Cln.prototype, {
    /*
     * Is opened popup?
     * @return {boolean}
    */
    isOpened: function() {
        return this._isOpened;
    },
    /*
     * Open popup.
     * @return {Calendula} this
    */
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
    /*
     * Close popup.
     * @return {Calendula} this
    */
    close: function() {
        var that = this;
        this._init();

        if(this.isOpened()) {
            this.timeout
                .clearAll(['open', 'close'])
                .set(function() {
                    that.timeout.clearAll('open');

                    that._update();

                    that._delOpenedEvents();

                    delMod(that._container, 'opened');

                    that.tooltip.hide();

                    that.event.trigger('close');
                }, 0, 'close');

            this._isOpened = false;
        }

        return this;
    },
    /*
     * Open/close popup.
     * @return {Calendula} this
    */
    toggle: function() {
        return this.isOpened() ? this.close() : this.open();
    },
    /*
     * Get/set value.
     * @param {string|number|Date} [value]
     * @return {*}
    */
    val: function(value) {
        if(!arguments.length) {
            return this._val;
        }

        if(value) {
            this._val = parseDateToObj(value);
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
    /*
     * Get/set a setting.
     *
     * @param {string} name
     * @param {string} [value]
     * @return {*}
    */
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

        d[name] = ['min', 'max', 'value'].indexOf(name) > -1 ? parseDateToObj(value) : value;

        if(name === 'showOn') {
            this._addSwitcherEvents(value);
        }

        if(container) {
            if(name === 'theme') {
                setMod(container, 'theme', value);
            } else if(name === 'daysAfterMonths') {
                if(value) {
                    setMod(container, 'days-after-months');
                } else {
                    delMod(container, 'days-after-months');
                }
            }

            if(name === 'position') {
                this.isOpened() && this._position(value);
            }

            if(rebuild[name]) {
                this._rebuild();
            }
        }

        return this;
    },
    /*
     * Destroy the datepicker.
    */
    destroy: function() {
        if(this._isInited) {
            this.close();

            this._removeExts();

            document.body.removeChild(this._container);

            this._data = null;
            this._container = null;
            this._isInited = null;
        }
    },
    _init: function() {
        if(this._isInited) {
            return;
        }

        this._isInited = true;

        var id = this.setting('id'),
            container = document.createElement('div');

        if(id) {
            container.id = id;
        }
        this._container = container;

        addClass(container, NS);
        setMod(container, 'theme', this._data.theme);

        if(this.setting('daysAfterMonths')) {
            setMod(container, 'days-after-months');
        }

        this._rebuild();

        document.body.appendChild(container);
    },
    _isAuto: function(prop) {
        return prop === 'auto' || isUndefined(prop);
    },
    _position: function(pos) {
        pos = (pos || '').split(' ');

        var switcher = this.setting('switcher'),
            left = pos[0],
            top = pos[1];

        if(switcher && (this._isAuto(left) || this._isAuto(top))) {
            var bestPos = this._calcBestPosition(left, top, switcher);
            left = bestPos.left;
            top = bestPos.top;
        }

        setPosition(this._container, this._calcPosition(left, top, switcher));
    },
    _calcPosition: function(left, top, switcher) {
        var offset = getOffset(switcher),
            con = this._container,
            conWidth = con.offsetWidth,
            conHeight = con.offsetHeight,
            offsetLeft = offset.left,
            offsetTop = offset.top,
            x,
            y;

        if(isString(left)) {
            switch(left) {
                case 'left':
                    x = offsetLeft;
                break;
                case 'center':
                    x = offsetLeft + (switcher.offsetWidth - conWidth) / 2;
                break;
                case 'right':
                    x = offsetLeft + switcher.offsetWidth - conWidth;
                break;
            }
        }

        if(isString(top)) {
            switch(top) {
                case 'top':
                    y = offsetTop - conHeight;
                break;
                case 'center':
                    y = offsetTop - (conHeight - switcher.offsetHeight) / 2;
                break;
                case 'bottom':
                    y = offsetTop + switcher.offsetHeight;
                break;
            }
        }

        return {
            left: x,
            top: y
        };
    },
    _calcVisibleSquare: function(left, top, winArea) {
        var conArea = {
                x1: left,
                y1: top,
                x2: left + this._container.offsetWidth,
                y2: top + this._container.offsetHeight
            },
            getIntersection = function(d1, d2, d3, d4) {
                if(d2 <= d3 || d1 >= d4) {
                    return 0;
                }

                return Math.min(d2, d4) - Math.max(d1, d3);
            },
            width = getIntersection(conArea.x1, conArea.x2, winArea.x1, winArea.x2),
            height = getIntersection(conArea.y1, conArea.y2, winArea.y1, winArea.y2);

        return width * height;
    },
    _calcBestPosition: function(left, top, switcher) {
        var maxArea = -1,
            areaIndex = 0,
            winArea = this._winArea(),
            isLeftAuto = this._isAuto(left),
            isTopAuto = this._isAuto(top);

        this._bestPositions.forEach(function(position, i) {
            var leftPos = position[0],
                topPos = position[1],
                offset,
                area;

            if ((isLeftAuto && isTopAuto) ||
                (isLeftAuto && top === topPos) ||
                (isTopAuto && left === leftPos)) {
                offset = this._calcPosition(leftPos, topPos, switcher);
                area = this._calcVisibleSquare(offset.left, offset.top, winArea);
                if(area > maxArea) {
                    maxArea = area;
                    areaIndex = i;
                }
            }
        }, this);

        var bestPosition = this._bestPositions[areaIndex];
        return {
            left: bestPosition[0],
            top: bestPosition[1]
        };
    },
    _bestPositions: [
        ['left', 'bottom'],
        ['left', 'top'],
        ['right', 'bottom'],
        ['right', 'top'],
        ['center', 'bottom'],
        ['center', 'top']
    ],
    _winArea: function() {
        var docElement = document.documentElement,
            pageX = window.pageXOffset,
            pageY = window.pageYOffset;

        return {
            x1: pageX,
            y1: pageY,
            x2: pageX + docElement.clientWidth,
            y2: pageY + docElement.clientHeight
        };
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
        this._position(this.setting('position'));
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
    _onresize: function() {
        this._update();
    },
    _onscroll: function() {
        this._update();
    },
    _rebuild: function() {
        var isOpened = this.isOpened();
        if(isOpened) {
            this._delOpenedEvents();
        }

        this._container.innerHTML = this.template.get('main');

        if(isOpened) {
            this._openedEvents();
            this._monthSelector(this._currentDate.month, false);
            this._yearSelector(this._currentDate.year, false);
        }
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
                that._onresize();
            }, 'open')
            .on(document, 'scroll', function() {
                that._onscroll();
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
                that.tooltip.show(target, that.title.get(ymdToISO(y, m, d)));
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
    _maxColor: 5,
    _decolorize: function(selector) {
        for(var c = 0; c < this._maxColor; c++) {
            var elems = this._elemAll(selector, 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                delMod(elems[i], 'color', c);
            }
        }
    },
    _colorizeMonths: function(month) {
        var months = this._elemAll('month');

        this._decolorize('month');

        setMod(months[month], 'color', '0');

        if(month - 1 >= MIN_MONTH) {
            setMod(months[month - 1], 'color', '0');
        }

        if(month + 1 <= MAX_MONTH) {
            setMod(months[month + 1], 'color', '0');
        }

        var n = 1;
        for(var c = month - 2; c >= MIN_MONTH && n < this._maxColor; c--, n++) {
            setMod(months[c], 'color', n);
        }

        n = 1;
        for(c = month + 2; c <= MAX_MONTH && n < this._maxColor; c++, n++) {
            setMod(months[c], 'color', n);
        }
    },
    _colorizeYears: function(year) {
        var years = this._elemAll('year'),
            startYear = this._data._startYear;

        this._decolorize('year');

        setMod(years[year - startYear], 'color', '0');

        var n = 1;
        for(var c = year - 1; c >= startYear && n < this._maxColor; c--, n++) {
            setMod(years[c - startYear], 'color', n);
        }

        n = 1;
        for(c = year + 1; c <= this._data._endYear && n < this._maxColor; c++, n++) {
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
    _switcherText: function() {
        var date = this._currentDate,
            m = this.text('months'),
            cm = this.text('caseMonths');

        return date.day + ' ' + (cm || m)[date.month] + ' ' + date.year;
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
    _elem: function(e, m, val) {
        return this._container.querySelector('.' + elem(e, m, val));
    },
    _elemAll: function(e, m, val) {
        return this._container.querySelectorAll('.' + elem(e, m, val));
    },
    _elemAllContext: function(context, e, m, val) {
        return context.querySelectorAll('.' + elem(e, m, val));
    }
});

extend(Cln.prototype, {
    _initExts: function(data) {
        Cln._exts.forEach(function(ext) {
            var name = ext[0],
                Constr = ext[1] || function() {},
                prot = ext[2];

            extend(Constr.prototype, prot);

            this[name] = new Constr();

            var obj = this[name];
            obj.parent = this;
            obj.init && obj.init(this._data, this._container);
        }, this);
    },
    _removeExts: function() {
        Cln._exts.forEach(function(ext) {
            var name = ext[0];

            this[name].destroy();
            delete this[name];
        }, this);
    }
});

Cln._exts = [];

Cln.addExt = function(name, constr, prot) {
    Cln._exts.push([name, constr, prot]);
};

/**
 * Add a leading zero.
 * @param {number} value
 * @return {string}
 */
function leadZero(value) {
    return (value < 10 ? '0' : '') + value;
}

/**
 * Convert a date to ISO format.
 * @param {number} year
 * @param {number} month - 0-11
 * @param {number} day
 * @return {string}
 */
function ymdToISO(year, month, day) {
    return [year, leadZero(month + 1), leadZero(day)].join('-');
}

/**
 * Parse a date.
 * @param {string|number|Date} value
 * @return {Date}
 */
function parseDate(value) {
    var date = null,
        match,
        buf;

    if(value) {
        if(isString(value)) {
            if(value === 'today') {
                return new Date();
            }

            match = /^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(value);
            if(match) {
                    buf = [match[3], match[2], match[1]];
            } else {
                match = /^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(value);
                if(match) {
                    buf = [match[1], match[2], match[3]];
                }
            }

            if(buf) {
                date = new Date(parseNum(buf[2]), parseNum(buf[1] - 1), parseNum(buf[0]));
            }
        } else if(isObject(value)) {
            if(value instanceof Date) {
                date = value;
            } else if(value.year && value.day) {
                date = new Date(value.year, value.month, value.day, 12, 0, 0, 0);
            }
        } else if(isNumber(value)) {
            date = new Date(value);
        }
    }

    return date;
}

/**
 * Parse a date and convert to ISO format.
 * @param {string|number|Date} value
 * @return {string|null}
 */
function parseDateToISO(value) {
    var d = parseDate(value);
    if(d) {
        return [d.getFullYear(), leadZero(d.getMonth() + 1), leadZero(d.getDate())].join('-');
    } else {
        return null;
    }
}

/**
 * Convert a date to a object.
 * @param {string|number|Date} value
 * @return {Object}
 */
function parseDateToObj(value) {
    var d = parseDate(value);
    if(d) {
        return {
            day: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear()
        };
    } else {
        return {};
    }
}

var div = document.createElement('div'),
    /**
     * Get data attribute.
     * @param {Element} el
     * @param {string} name
     * @return {string|undefined}
     */
    dataAttr = div.dataset ? function(el, name) {
        return el.dataset[name];
    } : function(el, name) { // support IE9
        return el.getAttribute('data-' + name);
    },
    hasClassList = !!div.classList,
    /**
     * Add CSS class.
     * @param {Element} el
     * @param {string} name
     */
    addClass = hasClassList ? function(el, name) {
        el.classList.add(name);
    } : function(el, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        if(!re.test(name.className)) {
            el.className = (el.className + ' ' + name).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
        }
    },
    /**
     * Remove CSS class.
     * @param {Element} el
     * @param {string} name
     */
    removeClass = hasClassList ? function(el, name) {
        el.classList.remove(name);
    } : function(el, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        el.className = el.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
    },
    /**
     * Has CSS class.
     * @param {Element} el
     * @param {string} name
     */
    hasClass = hasClassList ? function(el, name) {
        return el.classList.contains(name);
    } : function(el, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        return el.className.search(re) !== -1;
    };

var NS = 'calendula';

/**
 * Build CSS class for bem-element.
 * @param {string} name - Bem-element name.
 * @param {string} [m] - Mod name.
 * @param {string} [val] - Mod value.
 * @return {string}
 */
function elem(name, m, val) {
    if(val === null || val === false) {
        m = '';
    } else if(val === true || val === undefined) {
        val = '';
    }

    return NS + '__' + name + (m ? '_' + m + (val === '' ? '' : '_' + val) : '');
}

/**
 * Build CSS class for bem-mod.
 * @param {string} name - Mod name.
 * @param {string} [val] - Mod value.
 * @return {string}
 */
function mod(name, val) {
    if(val === null || val === false) {
        name = '';
    } else if(val === true || val === undefined) {
        val = '';
    }

    return NS + (name ? '_' + name + (val === '' ? '' : '_' + val) : '');
}

/**
 * Remove bem-mod from DOM element.
 * @param {Element} el
 * @param {string} m - Mod name.
 */
function delMod(el, m) {
    var e = getElemName(el),
        selector = e ? elem(e, m) : mod(m),
        classes = (el.className || '').split(' ');

    classes.forEach(function(cl) {
        if(cl === selector || cl.search(selector + '_') !== -1) {
            removeClass(el, cl);
        }
    });
}

/**
 * Set bem-mod for DOM element.
 * @param {Element} el
 * @param {string} m - Mod name.
 * @param {string} [val] - Mod value.
 */
function setMod(el, m, val) {
    var e = getElemName(el);
    delMod(el, m);
    addClass(el, e ? elem(e, m, val) : mod(m, val));
}

/**
 * Has bem-mod for DOM element?
 * @param {Element} el
 * @param {string} m - Mod name.
 * @param {string} [val] - Mod value.
 */
function hasMod(el, m, val) {
    var e = getElemName(el);

    return hasClass(el, e ? elem(e, m, val) : mod(m, val));
}

/**
 * Has bem-element?
 * @param {Element} el
 * @param {string} e - Element name.
 * @return {boolean}
 */
function hasElem(el, e) {
    return hasClass(el, elem(e));
}

/**
 * Get bem-element name.
 * @param {Element} el
 * @return {string}
 */
function getElemName(el) {
    var buf = el.className.match(/__([^ _$]+)/);
    return buf ? buf[1] : '';
}

extend(Cln, {
    /**
     * Add holidays.
     * @param {string} locale
     * @param {Object} data
     */
    addHolidays: function(locale, data) {
        this._holidays = this._holidays || {};
        this._holidays[locale] = data;
    }
});

/**
 * Get data for holiday by date.
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @return {number|undefined}
 */
Cln.prototype.getHoliday = function(day, month, year) {
    var locale = this._data.locale,
        c = Cln._holidays;

    return c && c[locale] && c[locale][year] ? c[locale][year][day + '-' + (month + 1)] : undefined;
};

/*
 * JS objects to HTML.
 * @param {*} data
 * @return {string}
 */
var jshtml = (function() {
    var buildItem = function(data) {
        if(data === null || data === undefined) {
            return '';
        }

        var buf = [];

        if(isPlainObj(data)) {
            return tag(data);
        } else if(isArray(data)) {
            for(var i = 0, len = data.length; i < len; i++) {
                buf.push(buildItem(data[i]));
            }

            return buf.join('');
        } else {
            return '' + data;
        }
    };

    var tag = function(data) {
        var t = data.t || 'div',
            text = '<' + t + attrs(data) + '>';

        if(data.c) {
            text += buildItem(data.c);
        }

        text += '</' + t + '>';

        return text;
    };

    var attrs = function(data) {
        var keys = Object.keys(data),
            ignoredItems = ['c', 't', 'e', 'm'], // content, tag, element, modifier
            text = [],
            classes = [],
            i, len,
            buf = '';

        if(data.e) {
            classes.push(elem(data.e));
        }

        if(data.m) {
            if(data.e) {
                for(i in data.m) {
                    if(data.m.hasOwnProperty(i)) {
                        classes.push(elem(data.e, i, data.m[i]));
                    }
                }
            } else {
                for(i in data.m) {
                    if(data.m.hasOwnProperty(i)) {
                        classes.push(mod(i, data.m[i]));
                    }
                }
            }
        }

        if(classes.length) {
            text.push(attr('class', classes));
        }

        for(i = 0, len = keys.length; i < len; i++) {
            var item = keys[i];
            if(ignoredItems.indexOf(item) === -1) {
                text.push(attr(item, data[item]));
            }
        }

        buf = text.join(' ');

        return buf ? ' ' + buf : '';
    };

    var attr = function(name, value) {
        return value !== null && value !== undefined ?
            name + '="' + (isArray(value) ? value.join(' ') : value) + '"' : '';
    };

    return buildItem;
})();

extend(Cln, {
    _locales: [],
    _texts: {},
    /**
     * Add a locale.
     * @param {string} locale
     * @param {Object} texts
     */
    addLocale: function(locale, texts) {
        this._locales.push(locale);
        this._texts[locale] = texts;
        
        if(texts.def) {
            this._defaultLocale = locale;
        }
    }
});

/**
 * Get text by id for current locale.
 * @param {string} id
 * @return {*}
 */
Cln.prototype.text = function(id) {
    return Cln._texts[this._data.locale][id];
};

/**
 * Parse a number, fix for native parseInt.
 * @param {string} str
 * @return {number}
 */
function parseNum(str) {
    return parseInt(str, 10);
}

var isArray = Array.isArray;
/**
 * Is plain object?
 * @param {*} obj
 * @return {boolean}
 */
function isPlainObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Is a string?
 * @param {*} obj
 * @return {boolean}
 */
function isString(obj) {
    return typeof obj === 'string';
}

/**
 * Is a number?
 * @param {*} obj
 * @return {boolean}
 */
function isNumber(obj) {
    return typeof obj === 'number';
}

/**
 * Is a object?
 * @param {*} obj
 * @return {boolean}
 */
function isObject(obj) {
    return typeof obj === 'object';
}

/**
 * Is a undefined?
 * @param {*} obj
 * @return {boolean}
 */
function isUndefined(obj) {
    return typeof obj === 'undefined';
}

/*
 * Get offset of element.
 * @param {Element} el
 * @return {Object}
 */
 
function getOffset(el) {
    var box = {top: 0, left: 0};

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if(el && !isUndefined(el.getBoundingClientRect)) {
        box = el.getBoundingClientRect();
    }
    
    return {
        top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
        left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
    };
}

/*
 * Set position of element.
 * @param {Element} el
 * @param {Object} coords
 * @param {string|number} coords.left
 * @param {string|number} coords.top
 */
function setPosition(elem, coords) {
    setLeft(elem, coords.left);
    setTop(elem, coords.top);
}

/*
 * Set left.
 * @param {Element} el
 * @param {string|number} left
 */
function setLeft(elem, left) {
    elem.style.left = isNumber(left) ? left + 'px' : left;
}

/*
 * Set top.
 * @param {Element} el
 * @param {string|number} top
 */
function setTop(elem, top) {
    elem.style.top = isNumber(top) ? top + 'px' : top;
}

/*
 * Set translateY.
 * @param {Element} el
 * @param {string|number} top
 */
var setTranslateY = (function() {
    var div = document.createElement('div'),
        prop = false;
    
    ['Moz', 'Webkit', 'O', 'ms', ''].forEach(function(el) {
        var propBuf = el + (el ? 'T' : 't') + 'ransform';
        if(propBuf in div.style) {
            prop = propBuf;
        }
    });
    
    return prop === false ? function(el, top) {
        el.style.top = isNumber(top) ? top + 'px' : top;
    } : function(el, top) {
        el.style[prop] = 'translateY(' + (isNumber(top) ? top + 'px' : top) + ')';
    };
})();

var supportWheel = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
    'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

Cln.addExt('domEvent', function() {
    this._buf = [];
}, {
    onWheel: function(elem, callback, ns) {
        // handle MozMousePixelScroll in older Firefox
        return this.on(elem,
            supportWheel === 'DOMMouseScroll' ? 'MozMousePixelScroll' : supportWheel,
            supportWheel === 'wheel' ? callback : function(originalEvent) {
                if(!originalEvent) {
                    originalEvent = window.event;
                }

                var event = {
                    originalEvent: originalEvent,
                    target: originalEvent.target || originalEvent.srcElement,
                    type: 'wheel',
                    deltaMode: originalEvent.type === 'MozMousePixelScroll' ? 0 : 1,
                    deltaX: 0,
                    delatZ: 0,
                    preventDefault: function() {
                        originalEvent.preventDefault ?
                            originalEvent.preventDefault() :
                            originalEvent.returnValue = false;
                    }
                },
                k = -1 / 40;

                if(supportWheel === 'mousewheel') {
                    event.deltaY = k * originalEvent.wheelDelta;
                    if(originalEvent.wheelDeltaX) {
                        event.deltaX = k * originalEvent.wheelDeltaX;
                    }
                } else {
                    event.deltaY = originalEvent.detail;
                }

                return callback(event);
        }, ns);
    },
    on: function(elem, type, callback, ns) {
        if(elem && type && callback) {
            elem.addEventListener(type, callback, false);

            this._buf.push({
                elem: elem,
                type: type,
                callback: callback,
                ns: ns
            });
        }

        return this;
    },
    off: function(elem, type, callback, ns) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            var el = buf[i];
            if(el && el.elem === elem && el.callback === callback && el.type === type && el.ns === ns) {
                elem.removeEventListener(type, callback, false);
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    },
    offAll: function(ns) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            var el = buf[i];

            if(ns) {
                if(ns === el.ns) {
                    el.elem.removeEventListener(el.type, el.callback, false);
                    buf.splice(i, 1);
                    i--;
                }
            } else {
                el.elem.removeEventListener(el.type, el.callback, false);
            }
        }

        if(!ns) {
            this._buf = [];
        }

        return this;
    },
    destroy: function() {
        this.offAll();

        delete this._buf;
    }
});

Cln.addExt('event', function() {
    this._buf = [];
}, {
    on: function(type, callback) {
        if(type && callback) {
            this._buf.push({
                type: type,
                callback: callback
            });
        }

        return this;
    },
    off: function(type, callback) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            if(callback === buf[i].callback && type === buf[i].type) {
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    },
    trigger: function(type, data) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            if(type === buf[i].type) {
                buf[i].callback.call(this, {type: type}, data);
            }
        }

        return this;
    },
    destroy: function() {
        delete this._buf;
    }
});

var SATURDAY = 6,
    SUNDAY = 0;

Cln.addExt('template', null, {
    get: function(name) {
        return jshtml(this[name]());
    },
    days: function() {
        var buf = [];

        for(var m = MIN_MONTH; m <= MAX_MONTH; m++) {
            buf.push(this.month(m, this.parent._currentDate.year));
        }

        return buf;
    },
    dayNames: function() {
        var first = this.parent.text('firstWeekday') || 0,
            w = {
                first: first,
                last: !first ? SATURDAY : first - 1
            },
            n = first;

        for(var i = 0; i < 7; i++) {
            w[n] = i;

            n++;
            if(n > SATURDAY) {
                n = SUNDAY;
            }
        }

        return w;
    },
    month: function(m, y) {
        var date = new Date(y, m, 1, 12, 0, 0, 0),
            dateTs = date.getTime(),
            current = new Date(),
            isSelected = function(d, m, y) {
                var val = par._val;
                return d === val.day && m === val.month && y === val.year;
            },
            getTs = function(d) {
                if(!d.year) {
                    return null;
                }

                return new Date(d.year, d.month, d.day, 12, 0, 0, 0).getTime();
            },
            getTitleMonth = function() {
                var getValue = function(setting) {
                        return parseNum('' + setting.year + leadZero(setting.month));
                    },
                    min = getValue(minSetting),
                    max = getValue(maxSetting),
                    mods = {},
                    cur = parseNum('' + y + leadZero(m));

                if((minSetting && cur < min) || (maxSetting && cur > max)) {
                    mods.minmax = true;
                }

                return {
                    e: 'days-title-month',
                    m: mods,
                    c: month
                };
            };

        current.setHours(12, 0, 0, 0);

        var par = this.parent,
            weekday = date.getDay(),
            dayNames = this.dayNames(),
            dayIndex = dayNames[weekday],
            month = par.text('months')[m],
            minSetting = par.setting('min'),
            maxSetting = par.setting('max'),
            minTs = getTs(minSetting),
            maxTs = getTs(maxSetting),
            currentTs = current.getTime(),
            title,
            holiday,
            mods,
            objFirstRow = {
                t: 'tr',
                c: [
                    weekday !== dayNames.first ? {
                        t: 'td',
                        colspan: dayIndex,
                        e: 'empty',
                        c: dayIndex < 3 ? '' : getTitleMonth()
                    } : ''
                ]
            },
            objRow = objFirstRow,
            obj = {
                e: 'days-month',
                c: [
                    dayIndex < 3 ? getTitleMonth() : '',
                    {
                        t: 'table',
                        e: 'days-table',
                        c: [objRow]
                    }
                ]
            };

        for(var day = 1; date.getMonth() === m; date.setDate(++day)) {
            title = '';
            dateTs = +date;
            weekday = date.getDay();
            holiday = par.getHoliday(day, m, y);
            mods = {};

            if(weekday === SUNDAY || weekday === SATURDAY) {
                mods.holiday = true;
            } else {
                mods.workday = true;
            }

            if(holiday === 0) {
                mods.nonholiday = true;
            } else if(holiday === 1) {
                mods.highday = true;
            }

            if(isSelected(day, m, y)) {
                mods.selected = true;
            }

            if(currentTs === dateTs) {
                mods.now = true;
                title = par.text('today');
            }

            if((minTs && dateTs < minTs) || (maxTs && dateTs > maxTs)) {
                mods.minmax = true;
            }

            var tt = par.title.get(ymdToISO(y, m, day));
            if(tt) {
                mods['has-title'] = true;
                mods['title-color'] = tt.color || 'default';
            }

            if(weekday === dayNames.first) {
                objRow = {
                    t: 'tr',
                    c: []
                };

                obj.c[1].c.push(objRow);
            }

            objRow.c.push({
                t: 'td',
                e: 'day',
                m: mods,
                title: title,
                'data-month': m,
                'data-day': day,
                c: day
            });
        }

        return obj;
    },
    years: function() {
        var data = this.parent._data,
            startYear = data._startYear,
            endYear = data._endYear,
            buf = [{
                e: 'year-selector',
                c: {
                    e: 'year-selector-i'
                }
            }];

        for(var i = startYear; i <= endYear; i++) {
            buf.push({
                e: 'year',
                'data-year': i,
                c: i
            });
         }

        return buf;
    },
    months: function() {
        var buf = [{
            e: 'month-selector',
            c: {
                e: 'month-selector-i'
            }
        }];

        this.parent.text('months').forEach(function(el, i) {
            buf.push({
                e: 'month',
                'data-month': i,
                c: el
            });
        });

        return buf;
    },
    main: function() {
        var par = this.parent,
            wd = par.text('firstWeekday') || SUNDAY,
            dayNames = par.text('dayNames') || [],
            bufDayNames = [];

        par.text('shortDayNames').forEach(function(el, i, data) {
            bufDayNames.push({
                e: 'short-daynames-cell',
                m: {
                    n: wd
                },
                title: dayNames[wd] || data[wd],
                c: data[wd]
            });

            wd++;
            if(wd > SATURDAY) {
                wd = SUNDAY;
            }
        }, this);

        return [
            {
                e: 'short-daynames',
                c: bufDayNames
            }, {
                e: 'container',
                c: [{
                        e: 'days',
                        c: {
                            e: 'days-container',
                            c: this.days()
                        }
                    },
                    {
                        e: 'months',
                        c: this.months()
                    },
                    {
                        e: 'years',
                        c: {
                            e: 'years-container',
                            c: this.years()
                        }
                    }
                ]
            }
        ];
    },
    destroy: function() {}
});

Cln.addExt('timeout', function() {
    this._buf = [];
}, {    
    set: function(callback, time, ns) {
        var that = this,
            id = setTimeout(function() {
                callback();
                that.clear(id);
            }, time);

        this._buf.push({
            id: id,
            ns: ns
        });

        return id;
    },
    clear: function(id) {
        var buf = this._buf,
            index = -1;

        if(buf) {
            buf.some(function(el, i) {
                if(el.id === id) {
                    index = i;
                    return true;
                }

                return false;
            });

            if(index >= 0) {
                clearTimeout(buf[index].id);
                buf.splice(index, 1);
            }
        }
        
        return this;
    },
    clearAll: function(ns) {
        var oldBuf = this._buf,
            newBuf = [],
            nsArray = Array.isArray(ns) ? ns : [ns];

        oldBuf.forEach(function(el, i) {
            if(ns) {
                if(nsArray.indexOf(el.ns) !== -1) {
                    clearTimeout(el.id);
                } else {
                    newBuf.push(el);
                }
            } else {
                clearTimeout(el.id);
            }
        }, this);

        this._buf = ns ? newBuf : [];
        
        return this;
    },
    destroy: function() {
        this.clearAll();

        delete this._buf;
    }
});

Cln.addExt('title', function() {
    this._title = {};
}, {
    init: function(data) {
        this.set(data.title);
    },
    get: function(date) {
        var bufDate = parseDateToISO(date);
        return bufDate ? this._title[bufDate] : undefined;
    },
    set: function(data) {
        if(isArray(data)) {
            data.forEach(function(el) {
                this._set(data);
            }, this);
        } else if(isPlainObj(data)) {
            this._set(data);
        }
    },
    _set: function(data) {
        var bufDate = parseDateToISO(data.date),
            parent = this.parent,
            el;

        if(bufDate) {
            this._title[bufDate] = {text: data.text, color: data.color};

            if(parent._isInited) {
                el = parent._findDayByDate(parseDateToObj(data.date));
                if(el) {
                    setMod(el, 'has-title');
                    setMod(el, 'title-color', data.color);
                }
            }
        }
    },
    remove: function(date) {
        if(isArray(date)) {
            date.forEach(function(el) {
                this._remove(el);
            }, this);
        } else {
            this._remove(date);
        }
    },
    _remove: function(date) {
        var parent = this.parent,
            bufDate = parseDateToISO(date);

        if(bufDate) {
            delete this._title[bufDate];

            if(parent._isInited) {
                var day = parent._findDayByDate(parseDateToObj(date));
                if(day) {
                    delMod(day, 'has-title');
                    delMod(day, 'title-color');
                }
            }
        }
    },
    removeAll: function() {
        this._title = {};

        if(this.parent._isInited) {
            var days = this.parent._elemAll('day', 'has-title');
            if(days) {
                for(var i = 0, len = days.length; i < len; i++) {
                    delMod(days[i], 'has-title');
                    delMod(days[i], 'title-color');
                }
            }
        }
    },
    destroy: function() {
        delete this._title;
    }
});

Cln.addExt('tooltip', null, {
    create: function() {
        if(this._container) {
            return;
        }

        var el = document.createElement('div');
        addClass(el, elem('tooltip'));
        el.innerHTML = jshtml([{e: 'tooltip-text'}, {e: 'tooltip-tail'}]);

        document.body.appendChild(el);

        this._container = el;
    },
    show: function(target, data) {
        var dataBuf = data || {},
            margin = 5;

        this.create();
        setMod(this._container, 'theme', this.parent.setting('theme'));
        setMod(this._container, 'visible');

        this._container.querySelector('.calendula__tooltip-text').innerHTML = jshtml({
            c: dataBuf.text,
            e: 'tooltip-row'
        });

        setMod(this._container, 'color', dataBuf.color || 'default');

        this._isOpened = true;

        var offset = getOffset(target),
            x = offset.left - (this._container.offsetWidth - target.offsetWidth) / 2,
            y = offset.top - this._container.offsetHeight - margin;

        setPosition(this._container, {
            left: x,
            top: y
        });
    },
    hide: function() {
        if(this._isOpened) {
            delMod(this._container, 'visible');
            this._isOpened = false;
        }
    },
    destroy: function() {
        if(this._container) {
            this.hide();
            document.body.removeChild(this._container);
            delete this._container;
        }
    }
});

return Cln;

}));

})(this, this.document, Date, Math);

Calendula.addLocale('be', {
    months: [
        'студзень',
        'люты',
        'сакавік',
        'красавік',
        'май',
        'чэрвень',
        'ліпень',
        'жнівень',
        'верасень',
        'кастрычнік',
        'лістапад',
        'снежань'
    ],
    caseMonths: [
        'студзеня',
        'лютага',
        'сакавіка',
        'красавіка',
        'траўня',
        'траўня',
        'ліпеня',
        'жніўня',
        'верасня',
        'кастрычніка',
        'лістапада',
        'снежня'
    ],
    shortDayNames: ['Н', 'П', 'А', 'С', 'Ч', 'П', 'С'],
    dayNames: [
        'Нядзеля',
        'Панядзелак',
        'Аўторак',
        'Серада',
        'Чацьвер',
        'Пятніца',
        'Субота'
    ],
    today: 'Сення',
    firstWeekday: 1
});

Calendula.addLocale('de', {
    months: [
        'Januar',
        'Februar',
        'Marz',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ],
    shortDayNames: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    dayNames: [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag'
    ],
    today: 'Heute',
    firstWeekday: 1
});

Calendula.addLocale('en', {
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    shortDayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    today: 'Today',
    firstWeekday: 0,
    def: true
});

Calendula.addLocale('es', {
    months: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
    ],
    shortDayNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S?'],
    dayNames: [
        'Domingo',
        'Lunes',
        'Martes',
        'Mi?rcoles',
        'Jueves',
        'Viernes',
        'S?bado'
    ],
    today: 'Hoy',
    firstWeekday: 1
});

Calendula.addLocale('fr', {
    months: [
        'janvier',
        'février',
        'mars',
        'avril',
        'mai',
        'juin',
        'juillet',
        'août',
        'septembre',
        'octobre',
        'novembre',
        'décembre'
    ],
    shortDayNames: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
    ],
    today: 'Aujourd’hui',
    firstWeekday: 1
});

Calendula.addLocale('it', {
    months: [
        'gennaio',
        'febbraio',
        'marzo',
        'aprile',
        'maggio',
        'giugno',
        'luglio',
        'agosto',
        'settembre',
        'ottobre',
        'novembre',
        'dicembre'
    ],
    shortDayNames: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
    dayNames: [
        'Domenica',
        'Lunedì',
        'Martedì',
        'Mercoledì',
        'Giovedì',
        'Venerdì',
        'Sabato'
    ],
    today: 'Oggi',
    firstWeekday: 1
});

Calendula.addLocale('pl', {
    months: [
        'styczeń',
        'luty',
        'marzec',
        'kwiecień',
        'maj',
        'czerwiec',
        'lipiec',
        'sierpień',
        'wrzesień',
        'październik',
        'listopad',
        'grudzień'
    ],
    caseMonths: [
        'stycznia',
        'lutego',
        'marca',
        'kwietnia',
        'maja',
        'czerwca',
        'lipca',
        'sierpnia',
        'września',
        'października',
        'listopada',
        'grudnia'
    ],
    shortDayNames: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
    dayNames: [
        'Niedziela',
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota'
    ],
    today: 'Dziś',
    firstWeekday: 1
});

Calendula.addLocale('ru', {
    months: [
        'январь',
        'февраль',
        'март',
        'апрель',
        'май',
        'июнь',
        'июль',
        'август',
        'сентябрь',
        'октябрь',
        'ноябрь',
        'декабрь'
    ],
    caseMonths: [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря'
    ],
    shortDayNames: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
    dayNames: [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
    ],
    today: 'Сегодня',
    firstWeekday: 1
});

Calendula.addLocale('tr', {
    months: [
        'ocak',
        'şubat',
        'mart',
        'nisan',
        'mayıs',
        'haziran',
        'temmuz',
        'ağustos',
        'eylül',
        'ekim',
        'kasım',
        'aralık'
    ],
    shortDayNames: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    dayNames: [
        'Pazar',
        'Pazartesi',
        'Salı',
        'Çarşamba',
        'Perşembe',
        'Cuma',
        'Cumartesi'
    ],
    today: 'Bugün',
    firstWeekday: 1
});

Calendula.addLocale('uk', {
    months:[
        'січень',
        'лютий',
        'березень',
        'квітень',
        'травень',
        'червень',
        'липень',
        'серпень',
        'вересень',
        'жовтень',
        'листопад',
        'грудень'
    ],
    caseMonths: [
        'січня',
        'лютого',
        'березня',
        'квітня',
        'травня',
        'червня',
        'липня',
        'серпня',
        'вересня',
        'жовтня',
        'листопада',
        'грудня'
    ],
    shortDayNames: ['Н', 'П', 'В', 'С', 'Ч', 'П', 'С'],
    dayNames: [
        'Неділя',
        'Понеділок',
        'Вівторок',
        'Середа',
        'Четвер',
        'П’ятниця',
        'Субота'
    ],
    today: 'Сьогодні',
    firstWeekday: 1
});

Calendula.addHolidays('ru', {
    '2012': {
        '1-1': 1,
        '2-1': 1,
        '3-1': 1,
        '4-1': 1,
        '5-1': 1,
        '6-1': 1,
        '7-1': 1,
        '9-1': 1,
        '23-2': 1,
        '8-3': 1,
        '9-3': 1,
        '11-3': 0,
        '28-4': 0,
        '30-4': 1,
        '1-5': 1,
        '5-5': 0,
        '7-5': 1,
        '8-5': 1,
        '9-5': 1,
        '12-5': 0,
        '9-6': 0,
        '11-6': 1,
        '12-6': 1,
        '4-11': 1,
        '5-11': 1,
        '29-12': 0,
        '31-12': 1
    }, '2013': {
        '1-1': 1,
        '2-1': 1,
        '3-1': 1,
        '4-1': 1,
        '5-1': 1,
        '6-1': 1,
        '7-1': 1,
        '8-1': 1,
        '23-2': 1,
        '8-3': 1,
        '1-5': 1,
        '2-5': 1,
        '3-5': 1,
        '9-5': 1,
        '10-5': 1,
        '12-6': 1,
        '4-11': 1
    }, '2014': {
        '1-1': 1,
        '2-1': 1,
        '3-1': 1,
        '4-1': 1,
        '5-1': 1,
        '6-1': 1,
        '7-1': 1,
        '8-1': 1,
        '23-2': 1,
        '8-3': 1,
        '10-3': 1,
        '1-5': 1,
        '2-5': 1,
        '9-5': 1,
        '12-6': 1,
        '13-6': 1,
        '3-11': 1,
        '4-11': 1
    }, '2015': {
        '1-1': 1,
        '2-1': 1,
        '3-1': 1,
        '4-1': 1,
        '5-1': 1,
        '6-1': 1,
        '7-1': 1,
        '8-1': 1,
        '23-2': 1,
        '8-3': 1,
        '1-5': 1,
        '9-5': 1,
        '12-6': 1,
        '4-11': 1
    }, '2016': {
        '1-1': 1,
        '2-1': 1,
        '3-1': 1,
        '4-1': 1,
        '5-1': 1,
        '6-1': 1,
        '7-1': 1,
        '8-1': 1,
        '20-2': 0,
        '22-2': 1,
        '23-2': 1,
        '7-3': 1,
        '8-3': 1,
        '1-5': 1,
        '2-5': 1,
        '3-5': 1,
        '9-5': 1,
        '12-6': 1,
        '13-6': 1,
        '4-11': 1
    }
});

Calendula.addHolidays('tr', {
    '2012': {
        '1-1': 1,
        '23-4': 1,
        '1-5': 1,
        '19-5': 1,
        '30-8': 1,
        '29-10': 1
    }, '2013': {
        '1-1': 1,
        '23-4': 1,
        '1-5': 1,
        '19-5': 1,
        '7-8': 1,
        '8-8': 1,
        '9-8': 1,
        '10-8': 1,
        '30-8': 1,
        '14-10': 1,
        '15-10': 1,
        '16-10': 1,
        '17-10': 1,
        '18-10': 1,
        '28-10': 1,
        '29-10':1
    }, '2014': {
        '1-1': 1,
        '23-4': 1,
        '1-5': 1,
        '19-5': 1,
        '27-7': 1,
        '28-7': 1,
        '29-7': 1,
        '30-7': 1,
        '30-8': 1,
        '3-10': 1,
        '4-10': 1,
        '5-10': 1,
        '6-10': 1,
        '28-10': 1,
        '29-10': 1
    }, '2015': {
        '1-1': 1,
        '23-4': 1,
        '1-5': 1,
        '19-5': 1,
        '30-8': 1,
        '29-10': 1
    }, '2016': {
        '1-1': 1,
        '23-4': 1,
        '1-5': 1,
        '19-5': 1,
        '4-7': 1,
        '5-7': 1,
        '6-7': 1,
        '7-7': 1,
        '30-8': 1,
        '12-9': 1,
        '13-9': 1,
        '14-9': 1,
        '15-9': 1,
        '28-10': 1,
        '29-10': 1
    }
});

Calendula.addHolidays('uk', {
    '2012': {
        '1-1': 1,
        '2-1': 1,
        '6-1': 1,
        '7-1': 1,
        '3-3': 0,
        '8-3': 1,
        '9-3': 1,
        '16-4': 1,
        '28-4': 0,
        '30-4': 1,
        '1-5': 1,
        '2-5': 1,
        '9-5': 1,
        '4-6': 1,
        '28-6': 1,
        '29-6': 1,
        '7-7': 0,
        '24-8': 1
    }, '2013': {
        '1-1': 1,
        '7-1': 1,
        '8-3': 1,
        '1-5': 1,
        '2-5': 1,
        '3-5': 1,
        '5-5': 1,
        '6-5': 1,
        '9-5': 1,
        '10-5': 1,
        '18-5': 0,
        '1-6': 0,
        '23-6': 1,
        '24-6': 1,
        '28-6': 1,
        '24-8': 1,
        '26-8': 1
    }, '2014': {
        '1-1': 1,
        '2-1': 1,
        '3-1': 1,
        '6-1': 1,
        '7-1': 1,
        '11-1': 0,
        '25-1': 0,
        '8-2': 0,
        '8-3': 1,
        '10-3': 1,
        '20-4': 1,
        '21-4': 1,
        '1-5': 1,
        '2-5': 1,
        '9-5': 1,
        '8-6': 1,
        '9-6': 1,
        '28-6': 1,
        '30-6': 1,
        '24-8': 1,
        '25-8': 1
    }, '2015': {
        '1-1': 1,
        '7-1': 1,
        '8-3': 1,
        '1-5': 1,
        '2-5': 1,
        '9-5': 1,
        '28-6': 1,
        '24-8': 1
    }, '2016': {
        '1-1': 1,
        '7-1': 1,
        '8-1': 1,
        '16-1': 0,
        '7-3': 1,
        '8-3': 1,
        '12-3': 0,
        '1-5': 1,
        '2-5': 1,
        '3-5': 1,
        '9-5': 1,
        '19-6': 1,
        '20-6': 1,
        '27-6': 1,
        '28-6': 1,
        '2-7': 0,
        '24-8': 1,
        '14-10': 1
    }
});
