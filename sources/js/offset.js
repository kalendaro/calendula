extend(Calendula.prototype, {
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
