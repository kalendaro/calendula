function Title() {
    this._title = {};
}

extend(Title.prototype, {
    init: function(data) {
        this.set(data.title);
    },
    get: function(date) {
        var bufDate = this.parent._parseDateToISO(date);
        return bufDate ? this._title[bufDate] : undefined;
    },
    set: function(data) {
        if(isArray(data)) {
            data.forEach(function(el) {
                this._set(data);
            }, this);
        } else if(isPlainObj(data)) {
            this._set(data);
        }
    },
    _set: function(data) {
        var bufDate = this.parent._parseDateToISO(data.date),
            parent = this.parent,
            el;

        if(bufDate) {
            this._title[bufDate] = {text: data.text, color: data.color};

            if(parent._isInited) {
                el = parent._findDayByDate(parent._parseDateToObj(data.date));
                if(el) {
                    setMod(el, 'has-title');
                    setMod(el, 'title-color', data.color);
                }
            }
        }
    },
    remove: function(date) {
        if(isArray(date)) {
            date.forEach(function(el) {
                this._remove(el);
            }, this);
        } else {
            this._remove(date);
        }
    },
    _remove: function(date) {
        var parent = this.parent,
            bufDate = parent._parseDateToISO(date);

        if(bufDate) {
            delete this._title[bufDate];

            if(parent._isInited) {
                var day = parent._findDayByDate(parent._parseDateToObj(date));
                if(day) {
                    delMod(day, 'has-title');
                    delMod(day, 'title-color');
                }
            }
        }
    },
    removeAll: function() {
        this._title = {};

        if(this.parent._isInited) {
            var days = this.parent._elemAll('day', 'has-title');
            if(days) {
                for(var i = 0, len = days.length; i < len; i++) {
                    delMod(days[i], 'has-title');
                    delMod(days[i], 'title-color');
                }
            }
        }
    },
    destroy: function() {
        delete this._title;
    }
});
