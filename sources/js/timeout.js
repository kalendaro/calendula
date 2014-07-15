var Timeout = {
    _buf: [],
    set: function(callback, time, ns) {
        this._buf.push({
            id: setTimeout(callback, time),
            ns: ns
        });
    },
    clear: function(id) {
        this._buf.forEach(function(el, i) {
            if(el.id === id) {
                clearTimeout(id);
                this._buf.slice(i, 1);
            }
        }, this);
    },
    clearAll: function(ns) {
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
};
