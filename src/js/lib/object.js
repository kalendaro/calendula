export default {
    /**
     * Is plain object?
     * @param {*} obj
     * @returns {boolean}
     */
    isPlainObj(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },

    /**
     * Is a string?
     * @param {*} obj
     * @returns {boolean}
     */
    isString(obj) {
        return typeof obj === 'string';
    },

    /**
     * Is a number?
     * @param {*} obj
     * @returns {boolean}
     */
    isNumber(obj) {
        return typeof obj === 'number';
    },

    /**
     * Is a object?
     * @param {*} obj
     * @returns {boolean}
     */
    isObject(obj) {
        return typeof obj === 'object';
    },

    /**
     * Is a undefined?
     * @param {*} obj
     * @returns {boolean}
     */
    isUndefined(obj) {
        return typeof obj === 'undefined';
    }
};
