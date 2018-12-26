import Calendula from './calendula';

Calendula.extend(Calendula.prototype, {
    _initExtensions() {
        Calendula._exts.forEach((Ext) => {
            const obj = new Ext(this._data, this._dom);
            obj.parent = this;
            this[this._getExtensionName(Ext)] = obj;
        });
    },
    _getExtensionName(ext) {
        return ext.name[0].toLowerCase() + ext.name.substr(1);
    },
    _removeExtensions() {
        Calendula._exts.forEach((ext) => {
            const name = this._getExtensionName(ext);
            this[name].destroy && this[name].destroy();
            delete this[name];
        }, this);
    }
});

Calendula._exts = [];

Calendula.addExtension = (klass) => {
    Calendula._exts.push(klass);
};
