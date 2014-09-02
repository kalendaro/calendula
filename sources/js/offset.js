extend(Cln.prototype, {
    _left: function(elem, x) {
        elem.style.left = typeof x === 'number' ? x + 'px' : x;
    },
    _top: function(elem, y) {
        elem.style.top = typeof y === 'number' ? y + 'px' : y;
    },
    _position: function(elem, coords) {
        this._left(elem, coords.left);
        this._top(elem, coords.top);
    },
    position: function(pos) {
        var p = {left: 0, top: 0},
            buttonWidth, buttonHeight,
            buttonLeft, buttonTop;

        if(typeof pos === 'string') {
            b = pos.split('-');

            p.left = buttonLeft;
            switch(b[0]) {
                case 'right':
                    p.left += buttonWidth;
                break;
                case 'center':
                    p.left += buttonWidth / 2;
                break;
            }

            p.top = buttonTop;
            switch(b[0]) {
                case 'bottom':
                    p.top += buttonHeight;
                break;
                case 'center':
                    p.top += buttonHeight / 2;
                break;
            }
        } else {
            p = pos;
        }

        this._position(this._elem, pos);
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
