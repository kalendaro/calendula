'use strict';

import Calendula from './calendula';

Calendula.extend(Calendula.prototype, {
    _initExtensions: function() {
        Calendula._exts.forEach(function(Ext) {
            const obj = new Ext(this._data, this._dom);
            obj.parent = this;
            this[this._getExtensionName(Ext)] = obj;
        }, this);
    },
    _getExtensionName: function(ext) {
        return ext.name[0].toLowerCase() + ext.name.substr(1);
    },
    _removeExtensions: function() {
        Calendula._exts.forEach(function(ext) {
            const name = this._getExtensionName(ext);
            this[name].destroy();
            delete this[name];
        }, this);
    }
});

Calendula._exts = [];

Calendula.addExtension = function(klass) {
    Calendula._exts.push(klass);
};
