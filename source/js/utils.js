var elem = function(name, mod, val) {
    return NS + '__' + name + (mod ? '_' + mod + (val ? '_' + val : '') : '');
};

var mod = function(name, val) {
    return NS + '_' + name + (val ? '_' + val : '');
};

var extend = function(container, obj) {
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            container[i] = obj[i];
        }
    }
};

extend(Calendula.prototype, {
    _elem: function(name) {
        return this._container.querySelector('.' + elem(name));
    },
    _elemAll: function(name) {
        return this._container.querySelectorAll('.' + elem(name));
    },
    _top: function(elem, y) {
        elem.style.top = y + 'px';
    }
});
