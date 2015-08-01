var isArray = Array.isArray;
/**
 * Is plain object?
 * @param {*} obj
 * @return {boolean}
 */
function isPlainObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Is a string?
 * @param {*} obj
 * @return {boolean}
 */
function isString(obj) {
    return typeof obj === 'string';
}

/**
 * Is a number?
 * @param {*} obj
 * @return {boolean}
 */
function isNumber(obj) {
    return typeof obj === 'number';
}

/**
 * Is a object?
 * @param {*} obj
 * @return {boolean}
 */
function isObject(obj) {
    return typeof obj === 'object';
}

/**
 * Is a undefined?
 * @param {*} obj
 * @return {boolean}
 */
function isUndefined(obj) {
    return typeof obj === 'undefined';
}
