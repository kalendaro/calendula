/**
 * Extension: DOM event
 */
import Calendula from '../calendula';

export default class DomEvent {
    constructor() {
        this._buf = [];
    }

    /**
     * Attach an event handler function for a DOM element.
     *
     * @param {DOMElement} elem
     * @param {string} type
     * @param {Function} callback
     * @param {string} [ns] - Namespace.
     * @returns {domEvent} this
     */
    on(elem, type, callback, ns) {
        if (elem && type && callback) {
            elem.addEventListener(type, callback, false);

            this._buf.push({
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
     * @returns {domEvent} this
     */
    off(elem, type, callback, ns) {
        const buf = this._buf;

        for (let i = 0; i < buf.length; i++) {
            const el = buf[i];
            if (el && el.elem === elem && el.callback === callback && el.type === type && el.ns === ns) {
                elem.removeEventListener(type, callback, false);
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    }

    /**
     * Remove all event handler.
     *
     * @param {string} [ns] - Namespace.
     * @returns {domEvent} this
     */
    offAll(ns) {
        const buf = this._buf;

        for (let i = 0; i < buf.length; i++) {
            const el = buf[i];

            if (ns) {
                if (ns === el.ns) {
                    el.elem.removeEventListener(el.type, el.callback, false);
                    buf.splice(i, 1);
                    i--;
                }
            } else {
                el.elem.removeEventListener(el.type, el.callback, false);
            }
        }

        if (!ns) {
            this._buf = [];
        }

        return this;
    }

    destroy() {
        this.offAll();

        delete this._buf;
    }
}

Calendula.addExtension(DomEvent);
