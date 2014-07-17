var Calendula = (function(window, document) {

'use strict';

var NS = 'calendula',
    MIN_MONTH = 0,
    MAX_MONTH = 11;

var extend = function(container, obj) {
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            container[i] = obj[i];
        }
    }
    
    return container;
};

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

var elem = function(name, mod, val) {
    if(val === null || val === undefined) {
        val = '';
    }
    
    return NS + '__' + name + (mod ? '_' + mod + (val === '' ? '' : '_' + val) : '');
};

var mod = function(name, val) {
    if(val === null || val === undefined) {
        val = '';
    }
    
    return NS + '_' + name + (val === '' ? '' : '_' + val);
};

extend(Calendula.prototype, {
    _elem: function(name, mod, val) {
        return this._container.querySelector('.' + elem(name, mod, val));
    },
    _elemAll: function(name, mod, val) {
        return this._container.querySelectorAll('.' + elem(name, mod, val));
    },
    _left: function(elem, x) {
        elem.style.left = x + 'px';
    },
    _top: function(elem, y) {
        elem.style.top = y + 'px';
    },
    _position: function(elem, coords) {
        this._left(elem, coords.left);
        this._top(elem, coords.top);
    },
    _offset: function(elem) {
        var box = {top: 0, left: 0};

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if(typeof elem.getBoundingClientRect !== 'undefined') {
            box = elem.getBoundingClientRect();
        }
        
        return {
            top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
            left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
        };        
    }
});

var dataAttr = document.createElement('div').classList ? function(elem, name) {
    return elem.dataset[name];
} : function(elem, name) { // support IE9
    return elem.getAttribute('data-' + name);
};

var Timeout = {
    _buf: [],
    set: function(callback, time, ns) {
        this._buf.push({
            id: setTimeout(callback, time),
            ns: ns
        });
    },
    clear: function(id) {
        this._buf.forEach(function(el, i) {
            if(el.id === id) {
                clearTimeout(id);
                this._buf.slice(i, 1);
            }
        }, this);
    },
    clearAll: function(ns) {
        this._buf.forEach(function(el, i) {
            if(ns) {
                if(ns === el.ns) {
                    clearTimeout(el.id);
                    this._buf.slice(i, 1);
                }
            } else {
                this._buf.slice(i, 1);
            }
        }, this);
    }
};

var supportWheel = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
    'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

Calendula.prototype._events = {
    _buf: [],
    onWheel: function(elem, callback, ns) {
        // handle MozMousePixelScroll in older Firefox
        this.on(elem,
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
                };
                
                if(supportWheel === 'mousewheel') {
                    event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                    if(originalEvent.wheelDeltaX) {
                        event.deltaX = -1 / 40 * originalEvent.wheelDeltaX;
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
            this._buf.push({elem: elem, type: type, callback: callback, ns: ns});
        }
    },
    off: function(elem, type, callback, ns) {
        if(elem && type && callback) {
            this._buf.forEach(function(el, i) {
                if(el && el.type === type && el.elem === elem && el.callback === callback && el.ns === ns) {
                    elem.removeEventListener(type, callback, false);
                    this._buf.slice(i, 1);
                }
            }, this);
        }
    },
    offAll: function(ns) {
        this._buf.forEach(function(el) {
            if(el) {
                this.off(el.elem, el.type, el.callback, ns || el.ns);
            }
        }, this);
        
        if(!ns) {
            this._buf = [];
        }
    }
};

Calendula.prototype.template = function(name) {
    return this._templates[name]();
};

Calendula.prototype._templates = {
    prepare: function(text) {
        return text.replace(/\$/g, NS + '__');
    },
    attr: function(name, value) {
        return name === '' || name === null || name === undefined ? '' : ' ' + name + '="' + value + '"';
    },
    days: function(year) {
        var text = '';
        for(var m = MIN_MONTH; m <= MAX_MONTH; m++) {
            text += this.month(m, year);
        }
    
        return text;
    },
    weekdays: function() {
        var first = this.parent.text('firstWeekDay') || 0;
        var w = {
            first: first,
            last: !first ? 6 : first - 1,
        };
        
        var n = first;
        for(var i = 0; i < 7; i++) {
            w[n] = i;
            
            n++;
            if(n > 6) {
                n = 0;
            }
        }
        
        return w;
    },
    month: function(m, y) {
        var date = new Date(y, m, 1, 12, 0, 0),
            current = new Date(),
            currentStr = [current.getDate(), current.getMonth(), current.getFullYear()].join('-'),
            par = this.parent,
            weekday = date.getDay(),
            weekdays = this.weekdays(),
            dayIndex = weekdays[weekday],
            month = par.text('months')[m],
            daysMonth = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            className = '',
            text = [],
            isNow = function(day, month, year) {
                return Array.prototype.join.call(arguments, '-') === currentStr;
            };
            
        text.push('<div class="$days-month">');
        
        if(dayIndex < 3) {
            text.push('<div class="$days-title-month">' + month + '</div>');
        }
        
        text.push('<table class="$days-table"><tr>');
        
        if(weekday !== weekdays.first) {
            text.push('<td colspan="' + dayIndex + '" class="$empty">' + (dayIndex < 3 ? '' : '<div class="$days-title-month">' + month + '</div>') + '</td>');
        }
        
        var hasTr,
            title,
            selectedDay = par._val.day,
            selectedMonth = par._val.month,
            selectedYear = par._val.year;
        
        for(var day = 1; day <= daysMonth[m]; day++) {
            title = '';
            hasTr = false;
            date.setDate(day);
            weekday = date.getDay();

            // 0 - Sunday, 6 - Saturday
            className = (weekday === 0 || weekday === 6) ? '$day_holiday' : '$day_weekday';
            
            if(day === selectedDay && m === selectedMonth && y === selectedYear) {
                className += ' $day_selected';
            }
            
            if(isNow(day, m, y)) {
                className += ' $day_now';
                title = par.text('now');
            }
            
            text.push('<td' + this.attr('title', title) + ' class="$day ' + className + '" data-month="' + m + '" data-day="' + day + '">' + day + '</td>');
            if(weekday === weekdays.last) {
                text.push('</tr>');
                hasTr = true;
            }
        }
            
        if(!hasTr) {
            text.push('</tr>');
        }
        
        text.push('</table></div>');
        
        return text.join('');
    },
    years: function() {
        var buf = '<div class="$year-selector"><div class="$year-selector-i"></div></div>',
            startYear = this.parent._data._startYear,
            endYear = this.parent._data._endYear;
            
        for(var i = startYear; i <= endYear; i++) {
            buf += '<div class="$year" data-year="' + i + '">' + i + '</div>';
        }
        
        return buf;
    },
    months: function() {
        var buf = '<div class="$month-selector"><div class="$month-selector-i"></div></div>';
        this.parent.text('months').forEach(function(el, i) {
            buf += '<div class="$month" data-month="' + i + '">' + el + '</div>';
        });
        
        return buf;
    },
    main: function() {
        var shortWeekDays = this.parent.text('shortWeekDays'),
            wd = this.parent.text('firstWeekDay') || 0,
            weekdays = '';
            
        this.parent.text('shortWeekDays').forEach(function(el, i, data) {
            weekdays += '<div class="$short-weekdays-cell $short-weekdays-cell_n_' + wd + '"' + this.attr('title', data[wd]) + '>' + data[wd] + '</div>';
            wd++;
            if(wd > 6) { // Saturday
                wd = 0;
            }
        }, this);
        
return this.prepare('\
<div class="$short-weekdays">' + weekdays + '</div>\
<div class="$container">\
<div class="$days">\
    <div class="$days-container">' + this.days(this.parent._currentDate.year) + '</div>\
</div>\
<div class="$months">' + this.months() + '</div>\
<div class="$years"><div class="$years-container">' + this.years() + '</div></div>\
</div>\
');
    }
};

function leadZero(num) {
    return (num < 10 ? '0' : '') + num;
}

function isLeapYear(y) {
    if((!(y % 4) && (y % 100)) || !(y % 400)) {
        return true;
    }
    
    return false;
}

extend(Calendula, {
    _texts: {},
    _langs: [],
    addLocale: function(lang, texts) {
        this._langs.push(lang);
        this._texts[lang] = texts;
        
        if(texts.def) {
            this._defaultLang = lang;
        }
    }
});

Calendula.prototype.text = function(id) {
    return Calendula._texts[this._data.lang][id];
};

Calendula.addLocale('be', {
    months: ['студзень', 'люты', 'сакавік', 'красавік', 'май', 'чэрвень', 'ліпень', 'жнівень', 'верасень', 'кастрычнік', 'лістапад', 'снежань'],
    caseMonths: ['студзеня', 'лютага', 'сакавіка', 'красавіка', 'траўня', 'траўня', 'ліпеня', 'жніўня', 'верасня', 'кастрычніка', 'лістапада', 'снежня'],
    shortWeekDays: ['Н', 'П', 'А', 'С', 'Ч', 'П', 'С'],
    today: 'Сення',
    firstWeekDay: 1
});

Calendula.addLocale('de', {
    months: ['Januar', 'Februar', 'Marz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortWeekDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    today: 'Heute',
    firstWeekDay: 1
});

Calendula.addLocale('en', {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortWeekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    today: 'Today',
    firstWeekDay: 0,
    def: true
});

Calendula.addLocale('es', {
    months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    shortWeekDays: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    today: 'Hoy',
    firstWeekDay: 1
});

Calendula.addLocale('fr', {
    months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    shortWeekDays: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    today: 'Aujourd’hui',
    firstWeekDay: 1
});

Calendula.addLocale('it', {
    months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
    shortWeekDays: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
    today: 'Oggi',
    firstWeekDay: 1
});

Calendula.addLocale('pl', {
    months: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
    caseMonths: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
    shortWeekDays: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
    today: 'Dziś',
    firstWeekDay: 1
});

Calendula.addLocale('ru', {
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    caseMonths: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    shortWeekDays: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
    today: 'Сегодня',
    firstWeekDay: 1
});

Calendula.addLocale('tr', {
    months: ['ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'],
    shortWeekDays:['Pa', 'PT', 'Sa', 'Çarş', 'Per', 'CU', 'Ctesi'],
    today: 'Bugün',
    firstWeekDay: 1
});

Calendula.addLocale('uk', {
    months:['січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'],
    caseMonths: ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'],
    shortWeekDays: ['Н', 'П', 'В', 'С', 'Ч', 'П', 'С'],
    today: 'Сьогодні',
    firstWeekDay: 1
});


return Calendula;

})(this, this.document);
