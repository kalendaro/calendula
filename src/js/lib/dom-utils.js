import obj from './object';

var Dom = {
    /**
     * Get offset of element.
     *
     * @param {DOMElement} el
     * @returns {Object}
     */
    getOffset(el) {
        var box = {top: 0, left: 0};

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if (el && !obj.isUndefined(el.getBoundingClientRect)) {
            box = el.getBoundingClientRect();
        }

        return {
            top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
            left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
        };
    },

    /**
     * Set position of element.
     *
     * @param {DOMElement} el
     * @param {Object} coords
     * @param {string|number} coords.left
     * @param {string|number} coords.top
     */
    setPosition(elem, coords) {
        this.setLeft(elem, coords.left);
        this.setTop(elem, coords.top);
    },

    /**
     * Set left for a DOM element.
     *
     * @param {DOMElement} el
     * @param {string|number} left
     */
    setLeft(elem, left) {
        elem.style.left = obj.isNumber(left) ? left + 'px' : left;
    },

    /*
     * Set top for a DOM element.
     * @param {DOMElement} el
     * @param {string|number} top
     */
    setTop(elem, top) {
        elem.style.top = obj.isNumber(top) ? top + 'px' : top;
    },

    /**
     * Set translateY.
     *
     * @param {DOMElement} el
     * @param {string|number} top
     */
    setTranslateY: (function() {
        var div = document.createElement('div'),
            prop = false;

        ['Moz', 'Webkit', 'O', 'ms', ''].forEach(function(el) {
            var propBuf = el + (el ? 'T' : 't') + 'ransform';
            if(propBuf in div.style) {
                prop = propBuf;
            }
        });

        return prop === false ? function(el, top) {
            el.style.top = obj.isNumber(top) ? top + 'px' : top;
        } : function(el, top) {
            el.style[prop] = 'translateY(' + (obj.isNumber(top) ? top + 'px' : top) + ')';
        };
    })()
};

export default Dom;
