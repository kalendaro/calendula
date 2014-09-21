extend(Cln.prototype, {
    _initExts: function(data) {
        this._exts = data;

        data.forEach(function(el) {
            var name = el[0],
                Cls = el[1];

            this[name] = new Cls();

            extend(this[name], _Em);

            this[name]['parent'] = this;
            this[name]['init'] && this[name]['init'](this._data, this._container);
        }, this);
    },
    _removeExts: function() {
        this._exts.forEach(function(el) {
            var ext = el[0];
            this[ext].destroy();
            delete this[ext];
        }, this);

        delete this._exts;
    }
});
