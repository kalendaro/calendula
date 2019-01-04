/**
 * Extension: Event
 */
export default class Event {
    constructor() {
        this._buffer = [];
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
            this._buffer.push({
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
        for (let i = 0; i < this._buffer.length; i++) {
            const item = this._buffer[i];
            if (callback === item.callback && type === item.type) {
                this._buffer.splice(i, 1);
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
        for (let i = 0; i < this._buffer.length; i++) {
            const item = this._buffer[i];
            if (type === item.type) {
                item.callback.call(this, {type: type}, data);
            }
        }

        return this;
    }

    destroy() {
        delete this._buffer;
    }
}
