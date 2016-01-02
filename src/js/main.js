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

            if((isLeftAuto && isTopAuto) ||
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
