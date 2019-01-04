/**
 * Extension: DOM event
 */
export default class DomEvent {
    constructor() {
        this._buffer = [];
    }

    /**
     * Attach an event handler function for a DOM element.
     *
     * @param {DOMElement} elem
     * @param {string} type
     * @param {Function} callback
     * @param {string} [ns] - Namespace.
     * @returns {DomEvent} this
     */
    on(elem, type, callback, ns) {
        if (elem && type && callback) {
            elem.addEventListener(type, callback, false);

            this._buffer.push({
                elem: elem,
                type: type,
                callback: callback,
                ns: ns
            });
        }

        return this;
    }

    /**
     * Remove an event handler.
     *
     * @param {DOMElement} elem
     * @param {string} type
     * @param {Function} callback
     * @param {string} [ns] - Namespace.
     * @returns {DomEvent} this
     */
    off(elem, type, callback, ns) {
        for (let i = 0; i < this._buffer.length; i++) {
            const item = this._buffer[i];
            if (item && item.elem === elem && item.callback === callback && item.type === type && item.ns === ns) {
                elem.removeEventListener(type, callback, false);
                this._buffer.splice(i, 1);
                i--;
            }
        }

        return this;
    }

    /**
     * Remove all event handler.
     *
     * @param {string} [ns] - Namespace.
     * @returns {DomEvent} this
     */
    offAll(ns) {
        for (let i = 0; i < this._buffer.length; i++) {
            const item = this._buffer[i];

            if (ns) {
                if (ns === item.ns) {
                    item.elem.removeEventListener(item.type, item.callback, false);
                    this._buffer.splice(i, 1);
                    i--;
                }
            } else {
                item.elem.removeEventListener(item.type, item.callback, false);
            }
        }

        if (!ns) {
            this._buffer = [];
        }

        return this;
    }

    destroy() {
        this.offAll();

        delete this._buffer;
    }
}
