/*
 * Get offset of element.
 * @param {Element} el
 * @return {Object}
 */
 
function getOffset(el) {
    var box = {top: 0, left: 0};

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if(el && !isUndefined(el.getBoundingClientRect)) {
        box = el.getBoundingClientRect();
    }
    
    return {
        top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
        left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
    };
}

/*
 * Set position of element.
 * @param {Element} el
 * @param {Object} coords
 * @param {string|number} coords.left
 * @param {string|number} coords.top
 */
function setPosition(elem, coords) {
    setLeft(elem, coords.left);
    setTop(elem, coords.top);
}

/*
 * Set left.
 * @param {Element} el
 * @param {string|number} left
 */
function setLeft(elem, left) {
    elem.style.left = isNumber(left) ? left + 'px' : left;
}

/*
 * Set top.
 * @param {Element} el
 * @param {string|number} top
 */
function setTop(elem, top) {
    elem.style.top = isNumber(top) ? top + 'px' : top;
}

/*
 * Set translateY.
 * @param {Element} el
 * @param {string|number} top
 */
var setTranslateY = (function() {
    var div = document.createElement('div'),
        prop = false;
    
    ['Moz', 'Webkit', 'O', 'ms', ''].forEach(function(el) {
        var propBuf = el + (el ? 'T' : 't') + 'ransform';
        if(propBuf in div.style) {
            prop = propBuf;
        }
    });
    
    return prop === false ? function(el, top) {
        el.style.top = isNumber(top) ? top + 'px' : top;
    } : function(el, top) {
        el.style[prop] = 'translateY(' + (isNumber(top) ? top + 'px' : top) + ')';
    };
})();
