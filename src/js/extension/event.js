/**
 * Extension: Event
 */
import Calendula from '../calendula';

export default class Event {
    constructor() {
        this._buf = [];
    }

    /**
     * Attach a handler to an custom event.
     *
     * @param {string} type
     * @param {Function} callback
     * @returns {Event} this
     */
    on(type, callback) {
        if (type && callback) {
            this._buf.push({
                type: type,
                callback: callback
            });
        }

        return this;
    }

    /**
     * Remove a previously-attached custom event handler.
     *
     * @param {string} type
     * @param {Function} callback
     * @returns {Event} this
     */
    off(type, callback) {
        const buf = this._buf;

        for (let i = 0; i < buf.length; i++) {
            if (callback === buf[i].callback && type === buf[i].type) {
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    }

    /**
     * Execute all handlers for the given event type.
     *
     * @param {string} type
     * @param {*} [data]
     * @returns {Event} this
     */
    trigger(type, data) {
        const buf = this._buf;

        for (let i = 0; i < buf.length; i++) {
            if(type === buf[i].type) {
                buf[i].callback.call(this, {type: type}, data);
            }
        }

        return this;
    }

    destroy() {
        delete this._buf;
    }
}

Calendula.addExtension(Event);
