/*
 * Extension: Timeout
*/
Cln.addExt('timeout', function() {
    this._buf = [];
}, {    
    /**
     * Set timeout.
     * @param {Function} callback
     * @param {number} time
     * @param {string} [ns] - Namespace.
     * @return {Timeout} this
    */
    set: function(callback, time, ns) {
        var that = this,
            id = setTimeout(function() {
                callback();
                that.clear(id);
            }, time);

        this._buf.push({
            id: id,
            ns: ns
        });

        return id;
    },
    /**
     * Clear timeout.
     * @param {string} id
     * @return {Timeout} this
    */
    clear: function(id) {
        var buf = this._buf,
            index = -1;

        if(buf) {
            buf.some(function(el, i) {
                if(el.id === id) {
                    index = i;
                    return true;
                }

                return false;
            });

            if(index >= 0) {
                clearTimeout(buf[index].id);
                buf.splice(index, 1);
            }
        }
        
        return this;
    },
    /**
     * Clear all timeouts.
     * @param {string} [ns] - Namespace.
     * @return {Timeout} this
    */
    clearAll: function(ns) {
        var oldBuf = this._buf,
            newBuf = [],
            nsArray = Array.isArray(ns) ? ns : [ns];

        oldBuf.forEach(function(el, i) {
            if(ns) {
                if(nsArray.indexOf(el.ns) !== -1) {
                    clearTimeout(el.id);
                } else {
                    newBuf.push(el);
                }
            } else {
                clearTimeout(el.id);
            }
        }, this);

        this._buf = ns ? newBuf : [];
        
        return this;
    },
    /**
     * Destructor.
    */
    destroy: function() {
        this.clearAll();

        delete this._buf;
    }
});
