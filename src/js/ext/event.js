/*
 * Extension: Event
*/
Cln.addExt('event', function() {
    this._buf = [];
}, {
    /*
     * Attach a handler to an custom event.
     * @param {string} type
     * @param {Function} callback
     * @return {Event} this
    */
    on: function(type, callback) {
        if(type && callback) {
            this._buf.push({
                type: type,
                callback: callback
            });
        }

        return this;
    },
    /*
     * Remove a previously-attached custom event handler.
     * @param {string} type
     * @param {Function} callback
     * @return {Event} this
    */
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
    /*
     * Execute all handlers for the given event type.
     * @param {string} type
     * @param {*} [data]
     * @return {Event} this
    */
    trigger: function(type, data) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            if(type === buf[i].type) {
                buf[i].callback.call(this, {type: type}, data);
            }
        }

        return this;
    },
    /*
     * Destructor.
    */
    destroy: function() {
        delete this._buf;
    }
});
