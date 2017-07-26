/*
 * Extension: DOM event
*/
Cln.addExtension('domEvent', function() {
    this._buf = [];
}, {
    /*
     * Attach an event handler function for a DOM element.
     * @param {DOMElement} elem
     * @param {string} type
     * @param {Function} callback
     * @param {string} [ns] - Namespace.
     * @return {domEvent} this
    */
    on: function(elem, type, callback, ns) {
        if(elem && type && callback) {
            elem.addEventListener(type, callback, false);

            this._buf.push({
                elem: elem,
                type: type,
                callback: callback,
                ns: ns
            });
        }

        return this;
    },
    /*
     * Remove an event handler.
     * @param {DOMElement} elem
     * @param {string} type
     * @param {Function} callback
     * @param {string} [ns] - Namespace.
     * @return {domEvent} this
    */
    off: function(elem, type, callback, ns) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            var el = buf[i];
            if(el && el.elem === elem && el.callback === callback && el.type === type && el.ns === ns) {
                elem.removeEventListener(type, callback, false);
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    },
    /*
     * Remove all event handler.
     * @param {string} [ns] - Namespace.
     * @return {domEvent} this
    */
    offAll: function(ns) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            var el = buf[i];

            if(ns) {
                if(ns === el.ns) {
                    el.elem.removeEventListener(el.type, el.callback, false);
                    buf.splice(i, 1);
                    i--;
                }
            } else {
                el.elem.removeEventListener(el.type, el.callback, false);
            }
        }

        if(!ns) {
            this._buf = [];
        }

        return this;
    },
    /*
     * Destructor.
    */
    destroy: function() {
        this.offAll();

        delete this._buf;
    }
});
