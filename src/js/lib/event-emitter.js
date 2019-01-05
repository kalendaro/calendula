/**
 * Extension: Event
 */
export default class EventEmitter {
    constructor() {
        this._events = {};
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
            this._events[type] = (this._events[type] || []).push({
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
        if (this._events[type]) {
            this._events[type] = this._events[type].filter((item) => {
                return callback !== item.callback;
            });
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
        if (this._events[type]) {
            this._events[type].forEach((item) => {
                if (type === item.type) {
                    item.callback.call(this, {type: type}, data);
                }
            });
        }

        return this;
    }
}
