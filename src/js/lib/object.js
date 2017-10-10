export default {
    /**
     * Is plain object?
     * @param {*} obj
     * @return {boolean}
     */
    isPlainObj(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },

    /**
     * Is a string?
     * @param {*} obj
     * @return {boolean}
     */
    isString(obj) {
        return typeof obj === 'string';
    },

    /**
     * Is a number?
     * @param {*} obj
     * @return {boolean}
     */
    isNumber(obj) {
        return typeof obj === 'number';
    },

    /**
     * Is a object?
     * @param {*} obj
     * @return {boolean}
     */
    isObject(obj) {
        return typeof obj === 'object';
    },

    /**
     * Is a undefined?
     * @param {*} obj
     * @return {boolean}
     */
    isUndefined(obj) {
        return typeof obj === 'undefined';
    }
};

