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
