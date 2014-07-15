var elem = function(name, mod, val) {
    if(val === null || val === undefined) {
        val = '';
    }
    
    return NS + '__' + name + (mod ? '_' + mod + (val === '' ? '' : '_' + val) : '');
};

var mod = function(name, val) {
    if(val === null || val === undefined) {
        val = '';
    }
    
    return NS + '_' + name + (val === '' ? '' : '_' + val);
};

extend(Calendula.prototype, {
    _elem: function(name, mod, val) {
        return this._container.querySelector('.' + elem(name, mod, val));
    },
    _elemAll: function(name, mod, val) {
        return this._container.querySelectorAll('.' + elem(name, mod, val));
    },
    _left: function(elem, x) {
        elem.style.left = x + 'px';
    },
    _top: function(elem, y) {
        elem.style.top = y + 'px';
    },
    _position: function(elem, coords) {
        this._left(elem, coords.left);
        this._top(elem, coords.top);
    },
    _offset: function(elem) {
        var box = {top: 0, left: 0};

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if(typeof elem.getBoundingClientRect !== 'undefined') {
            box = elem.getBoundingClientRect();
        }
        
        return {
            top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
            left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
        };        
    }
});

var dataAttr = document.createElement('div').classList ? function(elem, name) {
    return elem.dataset[name];
} : function(elem, name) { // support IE9
    return elem.getAttribute('data-' + name);
};
