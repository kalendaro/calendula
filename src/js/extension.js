import Calendula from './calendula';

Calendula.extend(Calendula.prototype, {
    _initExtensions: function() {
        Calendula._exts.forEach(function(Ext) {
            var name = this._getExtensionName(Ext);
            var obj = new Ext();
            obj.parent = this;
            obj.init && obj.init(this._data, this._dom);
            this[name] = obj;
        }, this);
    },
    _getExtensionName: function(ext) {
        return ext.name[0].toLowerCase() + ext.name.substr(1);
    },
    _removeExtensions: function() {
        Calendula._exts.forEach(function(ext) {
            var name = this._getExtensionName(ext);
            this[name].destroy();
            delete this[name];
        }, this);
    }
});

Calendula._exts = [];

Calendula.addExtension = function(klass) {
    Calendula._exts.push(klass);
};
