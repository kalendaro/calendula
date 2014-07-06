var Calendula = (function(window, document) {

'use strict';

var NS = 'calendula';

var Calendula = function(data) {
    data = data || {};
    
    var current = new Date();
    
    this._data = {
        onselect: data.onselect || function(e, value) {},
        theme: data.theme || 'normal',
        lang: data.lang || Calendula._default,
        startYear: data.startYear || (current.getFullYear() - 11),
        endYear: data.endYear || (current.getFullYear() + 1)
    };
};

Calendula.prototype = {
    init: function() {
        var cur = new Date();
        if(this._isInited) {
            return;
        }
        
        this._templates.parent = this;
        
        this._isInited = true;
        this._day = cur.getDate();
        this._month = cur.getMonth();
        this._year = cur.getFullYear();
        
        var container = document.createElement('div');

        container.classList.add(NS);
        container.innerHTML = this.template('main');

        document.body.appendChild(container);
        
        this._container = container;
    },
    isOpened: function() {
        return this._isOpened;
    },
    open: function() {
        var that = this;
        
        this.init();
        
        this._ignoreDocumentClick = true;
        
        if(!this.isOpened()) {
            this.update();
            
            // For Firefox CSS3 animation
            setTimeout(function() {
                that._container.classList.add(mod('opened'));
            }, 1);
            
            this._openedEvents();
            
            this._isOpened = true;
        }
        
        return this;
    },
    close: function() {
        this.init();
        
        if(this.isOpened()) {
            this._ignoreDocumentClick = false;
            
            this.update();
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
    },
    update: function() {
        if(this._isInited) {
            this.init();
        }
    },
    resize: function() {
    },
    setTheme: function(name) {
        var container = this._container;
        if(container) {
            container.classList.remove(mod('theme', this._data.theme));
            this._data.theme = name;
            container.classList.add(mod('theme', name));
        }
    },
    destroy: function() {
        if(this._isInited) {
            this.close();
            
            this._events.offAll();
            
            document.body.removeChild(this._container);
            
            ['_isInited', '_container', '_isOpened', '_ignoreDocumentClick'].forEach(function(el) {
                delete this[el];
            }, this);
        }
    },
    _openedEvents: function() {
        var that = this;
        
        this._ignoreDocumentClick = false;
        
        this._events.on(document, 'click', function() {
            if(that._ignoreDocumentClick) {
                that._ignoreDocumentClick = false;
            } else {
                that.close();
            }
        }, 'open');
        
        this._events.on(window, 'resize', function() {
            that.resize();
        }, 'open');
        
        this._events.on(this._container, 'click', function() {
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
                that._monthSelector(that._month + k);
            }
        };
        
        this._events.onWheel(months, this._onwheelmonths, 'open');
        this._events.onWheel(days, this._onwheelmonths, 'open');
        
        this._events.on(months, 'click', function(e) {
            if(e.target.classList.contains(elem('month'))) {
                that._monthSelector(+e.target.dataset.month);
            }
        }, 'open');
        
        this._events.on(this._elem('years'), 'click', function(e) {
            if(e.target.dataset.year) {
                that._year = +e.target.dataset.year;
            }
        }, 'open');
        
        this._events.on(days, 'click', function(e) {
            var cl = elem('day', 'selected');
            var target = e.target;
            if(target.dataset.day && !target.classList.contains(cl)) {
                that._month = +target.dataset.month;
                that._day = +target.dataset.day;
                
                var selected = days.querySelector('.' + cl);
                if(selected) {
                    selected.classList.remove(cl);
                }
                
                target.classList.add(cl);
                
                that._data.onselect({
                    type: 'select'
                    }, {
                    day: that._day,
                    month: that._month,
                    year: that._year
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
        
        this._month = month;
        
        var months = this._elem('months');
        var monthHeight = this._elem('month').offsetHeight;
        var selector = this._elem('month-selector');
        var daysContainer = this._elem('days-container');
        var days = this._elem('days');
        var daysContainerTop;
        var monthsElems = this._elemAll('days-month');
        
        var top = Math.floor(this._month * monthHeight - (monthHeight / 2));
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
    },
    _delOpenedEvents: function() {
        this._events.offAll('open');
    },
    _buttonText: function() {
        var date = new Date(),
            m = this.text('months'),
            cm = this.text('caseMonths');
            
        return date.getDate() + ' ' + (cm || m)[date.getMonth()] + ' ' + date.getFullYear();
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
    _prepare: function(text) {
        return text.replace(/\$/g, NS + '__');
    },
    daysMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    days: function(year) {
        var text = '';
        for(var m = 0; m < this.daysMonth.length; m++) {
            text += this.month(m, year);
        }
    
        return text;
    },
    month: function(m, y) {
        var date = new Date(y, m, 1, 12, 0, 0),
            weekday = date.getDay() - 1,
            FEBRARY = 1,
            SATURDAY = 5,
            SUNDAY = 6,
            month = this.parent.text('months')[m],
            className = '',
            text = [];
            
        if (isLeapYear(y)) {
            this.daysMonth[FEBRARY] = 29;
        } else {
            this.daysMonth[FEBRARY] = 28;
        }
            
        text.push('<div class="$days-month">');
        
        if (weekday == -1) {
            weekday = SUNDAY;
        }
        
        if(weekday < 3) {
            text.push('<div class="$days-title-month">' + month + '</div>');
        }
        
        text.push('<table class="$days-table"><tr>');
        if(weekday > 0) {
            text.push('<td colspan="' + weekday + '" class="$empty">' + (weekday < 3 ? '' : '<div class="$days-title-month">' + month + '</div>') + '</td>');
        }
        
        var hasTr;
        
        for (var day = 1; day <= this.daysMonth[m]; day++) {
            hasTr = false;
            date.setDate(day);
            weekday = date.getDay() - 1;
            
            if (weekday == -1) {
                weekday = SUNDAY;
            }
            
            if (weekday != SUNDAY && weekday != SATURDAY) {
                className = '$day_weekday';
            } else {
                className = '$day_holiday';
            }
            
            if (day === this.parent.day && m === this.parent.month && y === this.parent.year) {
                className += ' $day_selected';
            }
            
            /*if (isNow(day, m, y)) {
                className += ' {n}now';
                title += that.getString('now');
            }*/
            
            text.push('<td class="$day ' + className + '" data-month="' + m + '" data-day="' + day + '">' + day + '</td>');
            if(weekday === SUNDAY) {
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
        var buf = '<div class="$year-selector"><div class="$year-selector-i"></div></div>';
        var startYear = this.parent._data.startYear;
        var endYear = this.parent._data.endYear;
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
        var weekdays = '';
        this.parent.text('shortWeekDays').forEach(function(el, i) {
            weekdays += '<td class="$short-weekdays-cell $short-weekdays-cell_n_' + i + '">' + el + '</td>';
        });
        
return this._prepare('\
<table class="$short-weekdays">' + weekdays + '</table>\
<div class="$container">\
<div class="$days">\
    <div class="$days-container">' + this.days(this.parent._year) + '</div>\
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
    if ((!(y % 4) && (y % 100)) || !(y % 400)) {
        return true;
    }
    
    return false;
}

var elem = function(name, mod, val) {
    return NS + '__' + name + (mod ? '_' + mod + (val ? '_' + val : '') : '');
};

var mod = function(name, val) {
    return NS + '_' + name + (val ? '_' + val : '');
};

var extend = function(container, obj) {
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            container[i] = obj[i];
        }
    }
};

extend(Calendula.prototype, {
    _elem: function(name) {
        return this._container.querySelector('.' + elem(name));
    },
    _elemAll: function(name) {
        return this._container.querySelectorAll('.' + elem(name));
    },
    _top: function(elem, y) {
        elem.style.top = y + 'px';
    }
});

extend(Calendula, {
    _texts: {},
    _langs: [],
    addLocale: function(lang, texts) {
        this._langs.push(lang);
        this._texts[lang] = texts;
        
        if(texts.def) {
            this._default = lang;
        }
    }
});

Calendula.prototype.text = function(id) {
    return Calendula._texts[this._data.lang][id];
};

Calendula.addLocale('be', {
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    shortWeekDays: ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']
});
Calendula.addLocale('en', {
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    shortWeekDays: ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']
});
Calendula.addLocale('ru', {
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    caseMonths: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    shortWeekDays: ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'],
    def: true
});
Calendula.addLocale('tr', {
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    shortWeekDays: ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']
});
Calendula.addLocale('uk', {
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    shortWeekDays: ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']
});

return Calendula;

})(this, this.document);
