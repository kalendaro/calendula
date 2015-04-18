Cln.addExt('event', function() {
    this._buf = [];
}, {
    on: function(type, callback) {
        if(type && callback) {
            this._buf.push({
                type: type,
                callback: callback
            });
        }

        return this;
    },
    off: function(type, callback) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            if(callback === buf[i].callback && type === buf[i].type) {
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    },
    trigger: function(type) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            if(type === buf[i].type) {
                buf[i].callback.apply(this, [{type: type}].concat(Array.prototype.slice.call(arguments, 1)));
            }
        }

        return this;
    },
    destroy: function() {
        delete this._buf;
    }
});
