function getOffset(el) {
    var box = {top: 0, left: 0};

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if(!isUndefined(el.getBoundingClientRect)) {
        box = el.getBoundingClientRect();
    }
    
    return {
        top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
        left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
    };
};

function setPosition(elem, x, y) {
    setLeft(elem, x);
    setTop(elem, y);
}

function setLeft(elem, x) {
    elem.style.left = isNumber(x) ? x + 'px' : x;
}

function setTop(elem, y) {
    elem.style.top = isNumber(y) ? y + 'px' : y;
}

var setTranslateY = (function() {
    var div = document.createElement('div'),
        prop = false;
    
    ['Moz', 'Webkit', 'O', 'ms', ''].forEach(function(el) {
        var propBuf = el + (el ? 'T' : 't') + 'ransform';
        if(propBuf in div.style) {
            prop = propBuf;
        }
    });
    
    return prop === false ? function(el, y) {
        el.style.top = isNumber(y) ? y + 'px' : y;
    } : function(el, y) {
        el.style[prop] = 'translateY(' + (isNumber(y) ? y + 'px' : y) + ')';
    };
})();

extend(Cln.prototype, {
    position: function() {
        var pos = this.setting('position') || 'left bottom',
            switcher = this.setting('switcher'),
            p = getOffset(switcher),
            buf, x, y,
            con = this._container,
            conWidth = con.offsetWidth,
            conHeight = con.offsetHeight,
            switcherWidth = switcher.offsetWidth,
            switcherHeight = switcher.offsetHeight;

        if(isString(pos)) {
            buf = pos.trim().split(/ +/);
            x = p.left;
            y = p.top;

            switch(buf[0]) {
                case 'center':
                    x += -(conWidth - switcherWidth) / 2;
                break;
                case 'right':
                    x += switcherWidth - conWidth;
                break;
            }

            switch(buf[1]) {
                case 'top':
                    y += -conHeight;
                break;
                case 'center':
                    y += -(conHeight - switcherHeight) / 2;
                break;
                case 'bottom':
                    y += switcherHeight;
                break;
            }
        } else {
            x = p.left;
            y = p.top;
        }

        setPosition(this._container, x, y);
    }
});
