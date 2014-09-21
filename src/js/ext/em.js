var _Em = {
    _elem: function(e, m, val) {
        return this._container.querySelector('.' + elem(e, m, val));
    },
    /*_elemContext: function(context, e, m, val) {
        return context.querySelector('.' + elem(e, m, val));
    },*/
    _elemAll: function(e, m, val) {
        return this._container.querySelectorAll('.' + elem(e, m, val));
    },
    _elemAllContext: function(context, e, m, val) {
        return context.querySelectorAll('.' + elem(e, m, val));
    }
};

extend(Cln.prototype, _Em);
