/**
 * Is a string?
 * @param {*} obj
 * @returns {boolean}
 */
export function isString(obj) {
    return typeof obj === 'string';
}

/**
 * Is a number?
 * @param {*} obj
 * @returns {boolean}
 */
export function isNumber(obj) {
    return typeof obj === 'number';
}

/**
 * Is a undefined?
 * @param {*} obj
 * @returns {boolean}
 */
export function isUndefined(obj) {
    return typeof obj === 'undefined';
}

/**
 * Is a object?
 * @param {*} obj
 * @returns {boolean}
 */
export function isObject(obj) {
    return typeof obj === 'object';
}

/**
 * Is plain object?
 * @param {*} obj
 * @returns {boolean}
 */
export function isPlainObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
