var Timeout = function() {};

extend(Timeout.prototype, {
    set: function(callback, time, ns) {
        this._buf = this._buf || [];

        var id = setTimeout(callback, time);
        this._buf.push({
            id: id,
            ns: ns
        });

        return id;
    },
    clear: function(id) {
        if(this._buf) {
            this._buf.forEach(function(el, i) {
                if(el.id === id) {
                    clearTimeout(id);
                    this._buf.slice(i, 1);
                }
            }, this);
        }
    },
    clearAll: function(ns) {
        if(this._buf) {
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
    }
});
