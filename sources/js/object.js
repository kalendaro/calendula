var isArray = Array.isArray;

var isPlainObj = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

var isString = function(obj) {
    return typeof obj === 'string';
};

var isNumber = function(obj) {
    return typeof obj === 'number';
};

var isObject = function(obj) {
    return typeof obj === 'object';
};

var isUndefined = function(obj) {
    return typeof obj === 'undefined';
};
