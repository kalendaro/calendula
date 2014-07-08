var Calendula = function(data) {
    data = extend({}, data || {});
    
    var current = new Date(),
        obj = this,
        data = extend(data, {
            onselect: data.onselect || function(e, value) {},
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

        container.classList.add(NS);
        container.classList.add(mod('theme', this._data.theme));
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
        
        var linkTo = this._data.linkTo,
            offset;
        if(linkTo) {
            offset = this._offset(linkTo);
            offset.top += linkTo.offsetHeight;
            this._position(this._container, offset);
        }
    },
    setTheme: function(name) {
        var container = this._container;
        if(container && this._data) {
            container.classList.remove(mod('theme', this._data.theme));
            container.classList.add(mod('theme', name));
            this._data.theme = name;
        }
    },
    setLang: function(lang) {
        if(this._data) {
            this._rebuild();
            this._data.lang = lang;
        }
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
    _resize: function() {
        this._update();
    },
    _rebuild: function() {
        // TODO
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
            that._resize();
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
                that._monthSelector(that._currentDate.month + k);
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
                that._currentDate.year = +e.target.dataset.year;
            }
        }, 'open');
        
        this._events.on(days, 'click', function(e) {
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
                
                that._data.onselect({
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
    },
    _delOpenedEvents: function() {
        this._events.offAll('open');
    },
    _buttonText: function() {
        var date = this._current(),
            m = this.text('months'),
            cm = this.text('caseMonths');
            
        return date.day + ' ' + (cm || m)[date.month] + ' ' + date.year;
    }
});
