var Calendula = (function(window, document) {

'use strict';

var NS = 'calendula';

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
        data = extend(data, {
            onselect: data.onselect || function(e, value) {},
            autoclose: typeof data.autoclose === 'undefined' ? true : data.autoclose,
            theme: data.theme || 'normal',
            lang: data.lang || Calendula._defaultLang,
            startYear: data.startYear || (current.getFullYear() - 11),
            endYear: data.endYear || (current.getFullYear() + 1)
        });
        
    if(!this instanceof Calendula) {
        obj = new Calendula(data);
    }
    
    obj._data = data;
    
    this.val(this._data.value);
    
    return obj;
};

extend(Calendula.prototype, {
    init: function() {
        var cur = new Date();
        if(this._isInited) {
            return;
        }
        
        this._templates.parent = this;
        
        this._isInited = true;
        
        var container = document.createElement('div');
        this._container = container;

        container.classList.add(NS);
        container.classList.add(mod('theme', this._data.theme));
        
        this._rebuild();

        document.body.appendChild(container);
    },
    isOpened: function() {
        return this._isOpened;
    },
    open: function() {
        var that = this;
        
        this.init();
        
        this._ignoreDocumentClick = true;
        
        if(!this.isOpened()) {
            // For Firefox CSS3 animation
            setTimeout(function() {
                that._container.classList.add(mod('opened'));
                that._update();
                that._monthSelector(that._currentDate.month);
                that._openedEvents();
            }, 1);
            
            this._isOpened = true;
        }
        
        return this;
    },
    close: function() {
        this.init();
        if(this.isOpened()) {
            this._ignoreDocumentClick = false;
            
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
        
        var container = this._container;
        if(name === 'theme' && container) {
            container.classList.remove(mod('theme', this._data.theme));
            container.classList.add(mod('theme', value));
        }
        
        this._data[name] = value;
        
        if(name === 'lang') {
            this._rebuild();
        }
        
        return this;
    },
    destroy: function() {
        if(this._isInited) {
            this.close();
            
            this._events.offAll();
            
            document.body.removeChild(this._container);
            
            ['_isInited', '_container', '_isOpened', '_ignoreDocumentClick', '_data'].forEach(function(el) {
                delete this[el];
            }, this);
        }
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
        if(this._isInited) {
            this.init();
        }
        
        var linkTo = this.setting('linkTo'),
            offset;
        if(linkTo) {
            offset = this._offset(linkTo);
            offset.top += linkTo.offsetHeight;
            this._position(this._container, offset);
        }
    },
    _resize: function() {
        this._update();
    },
    _rebuild: function() {
        this._container.innerHTML = this.template('main');
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
        
        this._events.on(this._container, 'click', function(e) {
            if(e.button) {
                return;
            }
            
            that._ignoreDocumentClick = true;
        }, 'open');
        
        var months = this._elem('months');
        var days = this._elem('days');
        
        this._onwheelmonths = function(e) {
            var k = 0;
            if(e.deltaY > 0) {
                k = 1;
            } else if(e.deltaY < 0) {
                k = -1;
            }
            
            if(k) {
                that._monthSelector(that._currentDate.month + k);
            }
        };
        
        this._events.onWheel(months, this._onwheelmonths, 'open');
        this._events.onWheel(days, this._onwheelmonths, 'open');
        
        this._events.on(months, 'click', function(e) {
            if(e.button) {
                return;
            }

            if(e.target.classList.contains(elem('month'))) {
                that._monthSelector(+e.target.dataset.month);
            }
        }, 'open');
        
        this._events.on(this._elem('years'), 'click', function(e) {
            if(e.button) {
                return;
            }

            if(e.target.dataset.year) {
                that._currentDate.year = +e.target.dataset.year;
            }
        }, 'open');
        
        this._events.on(days, 'click', function(e) {
            if(e.button) {
                return;
            }

            var cl = elem('day', 'selected');
            var target = e.target;
            if(target.dataset.day && !target.classList.contains(cl)) {
                that._currentDate.month = +target.dataset.month;
                that._currentDate.day = +target.dataset.day;
                
                var selected = days.querySelector('.' + cl);
                if(selected) {
                    selected.classList.remove(cl);
                }
                
                target.classList.add(cl);
                
                that.setting('onselect')({
                    type: 'select'
                }, {
                    day: that._currentDate.day,
                    month: that._currentDate.month,
                    year: that._currentDate.year
                });
                
                that.close();
            }
        }, 'open');
    },
    _monthSelector: function(month) {
        if(month < 0) {
            month = 0;
        } else if(month > 11) {
            month = 11;
        }
        
        this._currentDate.month = month;
        
        var months = this._elem('months');
        var monthHeight = this._elem('month').offsetHeight;
        var selector = this._elem('month-selector');
        var daysContainer = this._elem('days-container');
        var days = this._elem('days');
        var daysContainerTop;
        var monthsElems = this._elemAll('days-month');
        
        var top = Math.floor(this._currentDate.month * monthHeight - (monthHeight / 2));
        if(top <= 0) {
            top = 1;
        }
        
        if(top + selector.offsetHeight >= months.offsetHeight) {
            top = months.offsetHeight - selector.offsetHeight - 1;
        }
        
        this._top(this._elem('month-selector'), top);
        
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
    },
    _colorizeMonths: function(month) {
        var months = this._elemAll('month');
        for(var c = 0; c < 6; c++) {
            var elems = this._elemAll('month', 'color', c);
            for(var i = 0, len = elems.length; i < len; i++) {
                elems[i].classList.remove(elem('month', 'color', c));
            }
        }
        
        var cl0 = elem('month', 'color', '0');
        months[month].classList.add(cl0);
        
        if(month - 1 >= 0) {
            months[month - 1].classList.add(cl0);
        }
        
        if(month + 1 <= 11) {
            months[month + 1].classList.add(cl0);
        }
        
        var n = 1;
        for(c = month - 2; c >= 0 && n < 5; c--, n++) {
            months[c].classList.add(elem('month', 'color', n));
        }
        
        n = 1;
        for(c = month + 2; c <= 11 && n < 5; c++, n++) {
            months[c].classList.add(elem('month', 'color', n));
        }
    },
    _delOpenedEvents: function() {
        this._events.offAll('open');
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
        }, false);
    },    
    on: function(elem, type, callback, ns) {
        if(elem && type && callback) {
            elem.addEventListener(type, callback, false);
            this._buf.push({elem: elem, type: type, callback: callback, ns: ns});
        }
    },
    off: function(elem, type, callback, ns) {
        if(elem && type && callback) {
            elem.removeEventListener(type, callback, false);
            this._buf.forEach(function(el, i) {
                if(el && el.type === type && el.elem === elem && callback === el.callback && ns === ns) {
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
        for(var m = 0; m < 12; m++) {
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
            startYear = this.parent._data.startYear,
            endYear = this.parent._data.endYear;
            
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
<div class="$years">' + this.years() + '</div>\
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
    firstWeekDay: 0
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
