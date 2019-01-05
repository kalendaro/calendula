import { isAuto, calcPosition, calcBestPosition } from './lib/calc-position';
import { getCurrentDate, ymdToISO, parseDateToObj } from './lib/date.js';
import { setPosition, setTranslateY } from './lib/dom-utils';
import keyCodes from './lib/keycodes';
import { isString, isUndefined } from './lib/type';

import { MIN_MONTH, MAX_MONTH } from './consts';
import Block from './lib/block';

export default class Calendula extends Block {
    constructor(rawParams) {
        super(rawParams);

        const
            params = Calendula.extend({}, rawParams || {}),
            years = this._prepareYears(params.years);

        this.params = Calendula.extend(params, {
            autocloseable: isUndefined(params.autocloseable) ? true : params.autocloseable,
            closeAfterSelection: isUndefined(params.closeAfterSelection) ? true : params.closeAfterSelection,
            locale: params.locale || 'en',
            max: parseDateToObj(params.max),
            min: parseDateToObj(params.min),
            maxColor: params.maxColor || 5,
            showOn: params.showOn || 'click',
            theme: params.theme || 'default',
            startYear: years.start,
            endYear: years.end
        });

        this._name = 'calendula';

        this._initExtensions();

        this.val(this.setting('value'));

        this._addSwitcherEvents(this.setting('showOn'));
    }

    /**
     * Extend a object.
     *
     * @param {Object} dest
     * @param {Object} source
     * @returns {Object}
     */
    static extend(dest, source) {
        for (let i in source) {
            if (source.hasOwnProperty(i)) {
                dest[i] = source[i];
            }
        }

        return dest;
    }

    /**
     * Is opened popup?
     *
     * @returns {boolean}
     */
    isOpened() {
        return this._isOpened;
    }

    /**
     * Open popup.
     *
     * @returns {Calendula} this
     */
    open() {
        this._init();

        if (!this.isOpened()) {
            this.timeout
                .clearAll(['open', 'close'])
                .set(() => {
                    this.setMod(this._dom, 'opened', true);
                    this._update();
                    this._monthSelector(this._currentDate.month, false);
                    this._yearSelector(this._currentDate.year, false);
                    this._openedEvents();
                }, 0, 'open');

            this._isOpened = true;

            this.trigger('open');
        }

        return this;
    }

    /**
     * Close popup.
     *
     * @returns {Calendula} this
     */
    close() {
        this._init();

        if (this.isOpened()) {
            this.timeout
                .clearAll(['open', 'close'])
                .set(() => {
                    this.timeout.clearAll('open');

                    this._update();

                    this._delOpenedEvents();

                    this.delMod(this._dom, 'opened');

                    this.tooltip.hide();

                    this.trigger('close');
                }, 0, 'close');

            this._isOpened = false;
        }

        return this;
    }

    /**
     * Open/close popup.
     *
     * @returns {Calendula} this
     */
    toggle() {
        return this.isOpened() ? this.close() : this.open();
    }

    /**
     * Get/set value.
     *
     * @param {string|number|Date} [value]
     * @returns {*}
     */
    val(value) {
        if (!arguments.length) {
            return this._val;
        }

        if (value) {
            this._val = parseDateToObj(value);
            this._currentDate = Calendula.extend({}, this._val);
        } else {
            this._val = {};
            this._currentDate = getCurrentDate();
        }

        if (this._dom) {
            this._updateSelection();
        }

        this._updateSwitcher();
    }

    /**
     * Get/set a setting.
     *
     * @param {string} name
     * @param {string} [value]
     * @returns {*}
     */
    setting(name, value) {
        const dom = this._dom;

        if (arguments.length === 1) {
            return this.params[name];
        }

        this.params[name] = ['min', 'max', 'value'].indexOf(name) > -1 ? parseDateToObj(value) : value;

        if (name === 'showOn') {
            this._addSwitcherEvents(value);
        }

        if (dom) {
            if (name === 'theme') {
                this.setMod(dom, 'theme', value);
            } else if (name === 'daysAfterMonths') {
                if (value) {
                    this.setMod(dom, 'days-after-months');
                } else {
                    this.delMod(dom, 'days-after-months');
                }
            }

            if (name === 'position') {
                this.isOpened() && this._position(value);
            }

            if ({min: true, max: true, locale: true}[name]) {
                this._rebuild();
            }
        }

        return this;
    }

    /**
     * Destroy the datepicker.
     */
    destroy() {
        if (!this._isInited) { return; }

        delete this._events;

        this.close();

        this._destroyExtensions();

        document.body.removeChild(this._dom);

        this.params = null;
        this._dom = null;
        this._isInited = null;
    }

    _init() {
        if (this._isInited) { return; }

        this._isInited = true;

        const
            id = this.setting('id'),
            dom = document.createElement('div');

        dom.className = this._name;

        if (id) {
            dom.id = id;
        }
        this._dom = dom;

        this.setMod(dom, 'theme', this.setting('theme'));

        if (this.setting('daysAfterMonths')) {
            this.setMod(dom, 'days-after-months');
        }

        this._rebuild();

        document.body.appendChild(dom);
    }

    _position(pos) {
        let [left, top] = (pos || '').split(' ');

        const switcher = this.setting('switcher');
        let coords = {
            left,
            top
        };

        if (switcher && (isAuto(coords.left) || isAuto(coords.top))) {
            coords = calcBestPosition(coords, this._dom, switcher);
        }

        setPosition(this._dom, calcPosition(coords, this._dom, switcher));
    }

    _update() {
        this._init();
        this._position(this.setting('position'));
    }

    _findDayByDate(date) {
        if (date.year !== this._currentDate.year) {
            return null;
        }

        const month = this.findElemAll('days-month')[date.month];
        if (month) {
            const day = this.findElemAllContext(month, 'day')[date.day - 1];
            return day || null;
        }

        return null;
    }

    _onresize() {
        this._update();
    }

    _onscroll() {
        this._update();
    }

    _rebuild() {
        const isOpened = this.isOpened();
        if (isOpened) {
            this._delOpenedEvents();
        }

        this._dom.innerHTML = this.template.get('main');

        if (isOpened) {
            this._openedEvents();
            this._monthSelector(this._currentDate.month, false);
            this._yearSelector(this._currentDate.year, false);
        }
    }

    _rebuildDays() {
        this.findElem('days-container').innerHTML = this.template.get('days');
        this._monthSelector(this._currentDate.month, false);
    }

    _intoContainer(target) {
        let node = target;

        while (node) {
            if (node === this._dom) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    }

    _openedEvents() {
        this.domEvent.on(document, 'click', (e) => {
            if (e.button || !this.setting('autocloseable')) { return; }

            if (e.target !== this.setting('switcher') && !this._intoContainer(e.target)) {
                this.close();
            }
        }, 'open');

        this.domEvent
            .on(window, 'resize', () => {
                this._onresize();
            }, 'open')
            .on(document, 'scroll', () => {
                this._onscroll();
            }, 'open')
            .on(document, 'keypress', e => {
                const cd = this._currentDate;
                switch (e.keyCode) {
                    case keyCodes.ESC:
                        this.close();
                        break;
                    case keyCodes.PAGE_DOWN:
                        if (e.ctrlKey || e.altKey) {
                            this._monthSelector(cd.month + 1, true);
                        } else {
                            this._yearSelector(cd.year + 1, true);
                        }
                        e.preventDefault();
                        break;
                    case keyCodes.PAGE_UP:
                        if (e.ctrlKey || e.altKey) {
                            this._monthSelector(cd.month - 1, true);
                        } else {
                            this._yearSelector(cd.year - 1, true);
                        }
                        e.preventDefault();
                        break;
                }
            }, 'open')
            .on(this._dom, 'click', e => {
                if (e.button) { return; }

                this.tooltip.hide();
            }, 'open');

        const
            days = this.findElem('days'),
            months = this.findElem('months'),
            years = this.findElem('years');

        this._onwheelmonths = e => {
            const delta = this._getDeltaY(e);
            if (delta) {
                this._monthSelector(this._currentDate.month + delta, true);
                e.preventDefault();
            }
        };

        this._onwheelyears = e => {
            const delta = this._getDeltaY(e);
            if (delta) {
                this._yearSelector(this._currentDate.year + delta, true);
                e.preventDefault();
            }
        };

        this.domEvent
            .on(days, 'wheel', this._onwheelmonths, 'open')
            .on(months, 'wheel', this._onwheelmonths, 'open')
            .on(years, 'wheel', this._onwheelyears, 'open');

        this.domEvent.on(months, 'click', e => {
            if (e.button) {
                return;
            }

            if (this.hasElem(e.target, 'month')) {
                this._monthSelector(+e.target.dataset.month, true);
            }
        }, 'open');

        this.domEvent.on(years, 'click', e => {
            if (e.button) {
                return;
            }

            const y = e.target.dataset.year;
            if (y) {
                this._yearSelector(+y, true);
            }
        }, 'open');

        this.domEvent.on(days, 'mouseover', e => {
            const
                target = e.target,
                d = +target.dataset.day,
                m = +target.dataset.month,
                y = +this._currentDate.year;

            if (this.hasElem(target, 'day') && this.hasMod(target, 'has-title')) {
                this.tooltip.show(target, this.title.get(ymdToISO(y, m, d)));
            }
        }, 'open');

        this.domEvent.on(days, 'mouseout', e => {
            if (this.hasElem(e.target, 'day')) {
                this.tooltip.hide();
            }
        }, 'open');

        this.domEvent.on(days, 'click', e => {
            if (e.button) {
                return;
            }

            const
                cd = this._currentDate,
                target = e.target,
                day = target.dataset.day,
                month = target.dataset.month;

            if (day) {
                if (this.hasMod(target, 'minmax')) {
                    return;
                }

                if (!this.hasMod(target, 'selected')) {
                    cd.day = +day;
                    cd.month = +month;

                    const selected = days.querySelector('.' + this.e('day', 'selected'));
                    if (selected) {
                        this.delMod(selected, 'selected');
                    }

                    this.setMod(target, 'selected');

                    this.trigger('select', {
                        day: cd.day,
                        month: cd.month,
                        year: cd.year
                    });

                    if (this.setting('closeAfterSelection')) {
                        this.close();
                    }
                }
            }
        }, 'open');
    }

    _getDeltaY(e) {
        return e.deltaY >= 1 ? 1 : e.deltaY < 0 ? -1 : 0;
    }

    _monthSelector(month, anim) {
        if (month < MIN_MONTH) {
            month = MIN_MONTH;
        } else if (month > MAX_MONTH) {
            month = MAX_MONTH;
        }

        this._currentDate.month = month;

        const
            months = this.findElem('months'),
            monthHeight = this.findElem('month').offsetHeight,
            monthsElems = this.findElemAll('days-month'),
            monthElem = monthsElems[month],
            selector = this.findElem('month-selector'),
            daysContainer = this.findElem('days-container'),
            days = this.findElem('days');

        if (!anim) {
            this.setMod(days, 'noanim');
            this.setMod(months, 'noanim');
        }

        let top = Math.floor(this._currentDate.month * monthHeight - monthHeight / 2);
        if (top <= 0) {
            top = 1;
        }

        if (top + selector.offsetHeight >= months.offsetHeight) {
            top = months.offsetHeight - selector.offsetHeight - 1;
        }

        setTranslateY(selector, top);

        let daysContainerTop = -Math.floor(monthElem.offsetTop - days.offsetHeight / 2 + monthElem.offsetHeight / 2);
        if (daysContainerTop > 0) {
            daysContainerTop = 0;
        }

        let deltaHeight = days.offsetHeight - daysContainer.offsetHeight;
        if (daysContainerTop < deltaHeight) {
            daysContainerTop = deltaHeight;
        }

        setTranslateY(daysContainer, daysContainerTop);

        this._colorizeMonths(month);

        if (!anim) {
            this.timeout.set(() => {
                this.delMod(days, 'noanim');
                this.delMod(months, 'noanim');
            }, 0, 'anim');
        }
    }

    _yearSelector(year, anim) {
        const
            startYear = this.params.startYear,
            endYear = this.params.endYear,
            oldYear = this._currentDate.year;

        if (year < startYear) {
            year = startYear;
        } else if (year > endYear) {
            year = endYear;
        }

        this._currentDate.year = year;

        const
            years = this.findElem('years'),
            yearsContainer = this.findElem('years-container'),
            yearHeight = this.findElem('year').offsetHeight,
            selector = this.findElem('year-selector');

        if (!anim) {
            this.setMod(years, 'noanim');
        }

        const topSelector = Math.floor((this._currentDate.year - startYear) * yearHeight);
        let topContainer = -Math.floor((this._currentDate.year - startYear) * yearHeight - years.offsetHeight / 2);

        if (topContainer > 0) {
            topContainer = 0;
        }

        if (topContainer < years.offsetHeight - yearsContainer.offsetHeight) {
            topContainer = years.offsetHeight - yearsContainer.offsetHeight;
        }

        let k = 0;
        if (years.offsetHeight >= yearsContainer.offsetHeight) {
            if ((endYear - startYear + 1) % 2) {
                k = yearHeight;
            }

            topContainer = Math.floor((years.offsetHeight - yearsContainer.offsetHeight - k) / 2);
        }

        if (year !== oldYear) {
            this._rebuildDays(year);
        }

        setTranslateY(selector, topSelector);
        setTranslateY(yearsContainer, topContainer);

        this._colorizeYears(year);

        if (!anim) {
            this.timeout.set(() => {
                this.delMod(years, 'noanim');
            }, 0, 'anim');
        }
    }

    _decolorize(selector) {
        for (let c = 0; c < this.setting('maxColor'); c++) {
            const elems = this.findElemAll(selector, 'color', c);
            for (let i = 0, len = elems.length; i < len; i++) {
                this.delMod(elems[i], 'color', c);
            }
        }
    }

    _colorizeMonths(month) {
        const months = this.findElemAll('month');

        this._decolorize('month');

        this.setMod(months[month], 'color', '0');

        if (month - 1 >= MIN_MONTH) {
            this.setMod(months[month - 1], 'color', '0');
        }

        if (month + 1 <= MAX_MONTH) {
            this.setMod(months[month + 1], 'color', '0');
        }

        let n = 1;
        for (let c = month - 2; c >= MIN_MONTH && n < this.setting('maxColor'); c--, n++) {
            this.setMod(months[c], 'color', n);
        }

        n = 1;
        for (let c = month + 2; c <= MAX_MONTH && n < this.setting('maxColor'); c++, n++) {
            this.setMod(months[c], 'color', n);
        }
    }

    _colorizeYears(year) {
        const
            years = this.findElemAll('year'),
            startYear = this.setting('startYear');

        this._decolorize('year');

        this.setMod(years[year - startYear], 'color', '0');

        let n = 1;
        for (let c = year - 1; c >= startYear && n < this.setting('maxColor'); c--, n++) {
            this.setMod(years[c - startYear], 'color', n);
        }

        n = 1;
        for (let c = year + 1; c <= this.setting('_endYear') && n < this.setting('maxColor'); c++, n++) {
            this.setMod(years[c - startYear], 'color', n);
        }
    }

    _delOpenedEvents() {
        this.domEvent.offAll('open');
    }

    _prepareYears(y) {
        const current = getCurrentDate();
        let
            buffer,
            startYear,
            endYear;

        if (isString(y)) {
            buffer = y.trim().split(/[:,; ]/);
            startYear = parseInt(buffer[0], 10);
            endYear = parseInt(buffer[1], 10);

            if (!isNaN(startYear) && !isNaN(endYear)) {
                if (Math.abs(startYear) < 1000) {
                    startYear = current.year + startYear;
                }

                if (Math.abs(endYear) < 1000) {
                    endYear = current.year + endYear;
                }
            }
        }

        return {
            start: startYear || (current.year - 11),
            end: endYear || (current.year + 1)
        };
    }

    _updateSelection() {
        const daySelected = this.findElem('day', 'selected');
        if (daySelected) {
            this.delMod(daySelected, 'selected');
        }

        if (this._currentDate.year === this._val.year) {
            const months = this.findElemAll('days-month');
            if (months && months[this._val.month]) {
                const
                    elem = this.findElemAllContext(months[this._val.month], 'day'),
                    day = this._val.day - 1;

                if (elem && elem[day]) {
                    this.setMod(elem[day], 'selected');
                }
            }
        }
    }

    _addSwitcherEvents(showOn) {
        const
            switcher = this.setting('switcher'),
            events = Array.isArray(showOn) ? showOn : [ showOn || 'click' ],
            openedTagNames = ['input', 'textarea'],
            openedEvents = ['focus', 'mouseover'];

        this.domEvent.offAll('switcher');

        if (events.indexOf('none') !== -1) {
            return;
        }

        if (switcher) {
            const tagName = switcher.tagName.toLowerCase();
            events.forEach(item => {
                this.domEvent.on(switcher, item, () => {
                    if (openedTagNames.indexOf(tagName) !== -1 || openedEvents.indexOf(item) !== -1) {
                        this.open();
                    } else {
                        this.toggle();
                    }
                }, 'switcher');
            });
        }
    }

    _getSwitcherText() {
        const
            date = this._currentDate,
            m = this.text('months'),
            cm = this.text('caseMonths');

        return date.day + ' ' + (cm || m)[date.month] + ' ' + date.year;
    }

    _updateSwitcher() {
        const
            elem = this.setting('switcher'),
            text = this._getSwitcherText();

        if (elem) {
            let tagName = elem.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                elem.value = text;
            } else {
                elem.innerHTML = text;
            }
        }
    }
}

Calendula.version = '{{version}}';
