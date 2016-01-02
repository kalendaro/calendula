/*
 * Extension: Title
*/
Cln.addExt('title', function() {
    this._title = {};
}, {
    /**
     * Initialize title.
     * @param {Object} data
    */
    init: function(data) {
        this.set(data.title);
    },
    /**
     * Get title by date.
     * @param {Date|number|string} date
     * @return {?Object}
    */
    get: function(date) {
        var bufDate = parseDateToISO(date);
        return bufDate ? this._title[bufDate] : null;
    },
    /**
     * Set title by date.
     * @param {Object|Array} data
    */
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
        var bufDate = parseDateToISO(data.date),
            parent = this.parent,
            el;

        if(bufDate) {
            this._title[bufDate] = {text: data.text, color: data.color};

            if(parent._isInited) {
                el = parent._findDayByDate(parseDateToObj(data.date));
                if(el) {
                    setMod(el, 'has-title');
                    setMod(el, 'title-color', data.color);
                }
            }
        }
    },
    /**
     * Remove title.
     * @param {Date|number|string} date
    */
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
            bufDate = parseDateToISO(date);

        if(bufDate) {
            delete this._title[bufDate];

            if(parent._isInited) {
                var day = parent._findDayByDate(parseDateToObj(date));
                if(day) {
                    delMod(day, 'has-title');
                    delMod(day, 'title-color');
                }
            }
        }
    },
    /**
     * Remove all titles.
    */
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
    /**
     * Destructor.
    */
    destroy: function() {
        delete this._title;
    }
});
