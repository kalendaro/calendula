/**
 * Extension: Timeout
 */
import Calendula from '../calendula';

export default class Timeout {
    constructor() {
        this._buf = [];
    }

    /**
     * Set timeout.
     *
     * @param {Function} callback
     * @param {number} time
     * @param {string} [ns] - Namespace.
     * @returns {Timeout} this
     */
    set(callback, time, ns) {
        const
            that = this,
            id = setTimeout(function() {
                callback();
                that.clear(id);
            }, time);

        this._buf.push({
            id: id,
            ns: ns
        });

        return id;
    }
    
    /**
     * Clear timeout.
     *
     * @param {string} id
     * @returns {Timeout} this
     */
    clear(id) {
        const buf = this._buf;
        let index = -1;

        if (buf) {
            buf.some(function(el, i) {
                if (el.id === id) {
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
    }

    /**
     * Clear all timeouts.
     *
     * @param {string} [ns] - Namespace.
     * @returns {Timeout} this
     */
    clearAll(ns) {
        const
            oldBuf = this._buf,
            newBuf = [],
            nsArray = Array.isArray(ns) ? ns : [ns];

        oldBuf.forEach(function(el) {
            if (ns) {
                if (nsArray.indexOf(el.ns) !== -1) {
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
    }

    destroy() {
        this.clearAll();

        delete this._buf;
    }
}

Calendula.addExtension(Timeout);
