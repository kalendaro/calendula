var Calendula = (function(window, document) {

'use strict';

var NS = 'calendula';

var Calendula = function(prefs) {
    this._prefs = prefs || {
        lang: 'ru',
        startYear: 1990,
        endYear: 2014
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
    setDate: function(date) {
        this.update();
        
        return this;
    },
    getDate: function() {
        return date;
    },
    setPrefs: function(prefs) {
        return this;
    },
    _elem: function(name) {
        return this._container.querySelector('.' + elem(name));
    },
    _elemAll: function(name) {
        return this._container.querySelectorAll('.' + elem(name));
    },
    _top: function(elem, y) {
        elem.style.top = y + 'px';
    },
    setOpenedEvents: function() {
        var that = this;
        this.events.on(document, 'click', function() {
            if(that._ignoreDocumentClick) {
                that._ignoreDocumentClick = false;
            } else {
                that.close();
            }
        });
        
        this.events.on(window, 'resize', function() {
            that.resize();
        });
        
        this.events.on(this._container, 'click', function() {
            that._ignoreDocumentClick = true;
        });
        
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
        
        addWheelListener(months, this._onwheelmonths);
        addWheelListener(days, this._onwheelmonths);
        
        this.events.on(months, 'click', function(e) {
            if(e.target.classList.contains(elem('month'))) {
                that._monthSelector(+e.target.dataset.month);
            }
        });
        
        this.events.on(this._elem('years'), 'click', function(e) {
            if(e.target.dataset.year) {
                that._year = +e.target.dataset.year;
            }
        });
        
        this.events.on(days, 'click', function(e) {
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
            }
        });
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
        
        if(daysContainerTop < days.offsetHeight - daysContainer.offsetHeight) {
            daysContainerTop = days.offsetHeight - daysContainer.offsetHeight;
        }
        
        this._top(daysContainer, daysContainerTop);
    },
    delOpenedEvents: function() {
    },
    events: {
        _buf: [],
        on: function(elem, type, callback) {
            if(elem && type && callback) {
                elem.addEventListener(type, callback);
                this._buf.push({elem: elem, type: type, callback: callback});
            }
        },
        off: function(elem, type, callback) {
            if(elem && type && callback) {
                elem.removeEventListener(type, callback);
                this._buf.forEach(function(el, i) {
                    if(el.type === type && el.elem === elem && callback === el.callback) {
                        this._buf[i] = undefined;
                    }
                });
            }
        },
        destroy: function() {
            _buf.forEach(function(el) {
                this.off(el.elem, el.type, el.callback);
            }, this);
            
            this._buf = [];
        }
    },
    isOpened: function() {
        return this._isOpened;
    },
    open: function() {
        var that = this;
        
        this.init();
        
        if(!this.isOpened()) {
            this.update();
            setTimeout(function() {
                that._container.classList.add(mod('opened'));
            }, 1);
            this.setOpenedEvents();
            
            this._isOpened = true;
        }
        
        return this;
    },
    close: function() {
        this.init();
        
        if(this.isOpened()) {
            this.update();
            this._container.classList.remove(mod('opened'));
            
            this.delOpenedEvents();
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
    destroy: function() {
        if(this._isInited) {
            this._isInited = false;
            delete this._container;
        }
    }
};

var support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
          document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
          "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

var addWheelListener = function(elem, callback) {
    _addWheelListener(elem, support, callback);

    // handle MozMousePixelScroll in older Firefox
    if(support === 'DOMMouseScroll') {
        _addWheelListener(elem, 'MozMousePixelScroll', callback);
    }
};

var _addWheelListener = function(elem, eventName, callback, useCapture) {
    elem.addEventListener(eventName, support === 'wheel' ? callback : function(originalEvent) {
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
        
        if(support === 'mousewheel') {
            event.deltaY = -1 / 40 * originalEvent.wheelDelta;
            if(originalEvent.wheelDeltaX) {
                event.deltaX = - 1/40 * originalEvent.wheelDeltaX;
            }
        } else {
            event.deltaY = originalEvent.detail;
        }

        return callback(event);
    }, false);
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
        var startYear = this.parent._prefs.startYear;
        var endYear = this.parent._prefs.endYear;
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

Calendula._texts = {};
Calendula._langs = [];

Calendula.addLocale = function(lang, texts) {
    this._langs.push(lang);
    this._texts[lang] = texts;
};

Calendula.prototype.text = function(id) {
    return Calendula._texts[this._prefs.lang][id];
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
    shortWeekDays: ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']
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
