/**
 * Extend a object.
 * @param {Object} dest
 * @param {Object} source
 * @return {Object}
 */
function extend(dest, source) {
    for(var i in source) {
        if(source.hasOwnProperty(i)) {
            dest[i] = source[i];
        }
    }

    return dest;
}

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
