/*! Calendula | © 2016 Denis Seleznev | https://github.com/hcodes/calendula/ */

(function(window, document, Date, Math, undefined) {

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define('calendula', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Calendula = factory();
    }
}(this, function() {
    'use strict';
