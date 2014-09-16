extend(Cln.prototype, {
    _initPlugins: function(data) {
        this._plugins = data;

        data.forEach(function(el) {
            var name = el[0],
                Cls = el[1];

            this[name] = new Cls();

            extend(this[name], _Em);

            this[name]['parent'] = this;
            this[name]['init'] && this[name]['init'](this._data, this._container);
        }, this);
    },
    _removePlugins: function() {
        this._plugins.forEach(function(el) {
            var plugin = el[0];
            this[plugin].destroy();
            delete this[plugin];
        }, this);

        delete this._plugins;
    }
});
