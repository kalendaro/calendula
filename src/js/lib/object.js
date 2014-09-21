var isArray = Array.isArray;

function isPlainObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isString(obj) {
    return typeof obj === 'string';
}

function isNumber(obj) {
    return typeof obj === 'number';
}

function isObject(obj) {
    return typeof obj === 'object';
}

function isUndefined(obj) {
    return typeof obj === 'undefined';
}
