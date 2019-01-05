/**
 * Extension: Timeout
 */
export default class Timeout {
    init() {
        this._buffer = [];
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
        const id = setTimeout(() => {
            callback();
            this.clear(id);
        }, time);

        this._buffer.push({id, ns});

        return id;
    }

    /**
     * Clear timeout.
     *
     * @param {string} id
     * @returns {Timeout} this
     */
    clear(id) {
        let index = -1;

        if (this._buffer) {
            this._buffer.some((item, i) => {
                if (item.id === id) {
                    index = i;
                    return true;
                }

                return false;
            });

            if (index >= 0) {
                clearTimeout(this._buffer[index].id);
                this._buffer.splice(index, 1);
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
            oldBuffer = this._buffer,
            newBuffer = [],
            nsArray = Array.isArray(ns) ? ns : [ ns ];

        oldBuffer.forEach(item => {
            if (ns) {
                if (nsArray.indexOf(item.ns) !== -1) {
                    clearTimeout(item.id);
                } else {
                    newBuffer.push(item);
                }
            } else {
                clearTimeout(item.id);
            }
        });

        this._buffer = ns ? newBuffer : [];

        return this;
    }

    destroy() {
        this.clearAll();

        delete this._buffer;
    }
}
