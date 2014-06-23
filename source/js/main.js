var Calendula = (function(window, document) {
    var Calendula = function(prefs) {
        setDate: function(date) {
            this.update();
            
            return this;
        },
        getDate: function() {
            return date;
        },
        _lang: 'ru',
        text: function(id) {
            return this._texts[this._lang][id];
        },
        setPrefs: function(prefs) {
            return this;
        },
        isOpened: function() {
            
        },
        events: {
            _buf: [],
            on: function(elem, type, callback) {
                elem.addEventListener(type, callback);
                _buf.push({elem: elem, type: type, callback: callback);
            },
            off: function(elem, type, callback) {
                elem.removeEventListener(type, callback);
                this._buf.fo
            },
            destroy: function() {
                _buf.forEach(function(el) {
                    this.off(el.elem, el.type, el.callback);
                }, this);
                
                this._buf = [];
            }
        },
        open: function() {
            if(!this.isOpened()) {
                this.update();
                this.elems.container.addClass('calendula_show_yes');
            }
            
            return this;
        },
        close: function() {
            if(this.isOpened()) {
                this.update();
                this.elems.container.removeClass('calendula_show');
            }
            
            return this;
        },
        update: function() {
            if(this._isInited) {
                this.init();
            }
        },
        destroy: function() {
            if(this._isInited) {
            }
        }
    };
    
    var NS = 'calendula';
    var Templates = {
        main: function() {
return '<div class="{n} {n}_theme_{theme}">\
<div class="{n}__days"></div>\
<div class="{n}__month"></div>\
<div class="{n}__years"></div>\
</div>';

    };
    
    return Calendula;
})(this, this.document);