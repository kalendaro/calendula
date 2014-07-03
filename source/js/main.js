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
