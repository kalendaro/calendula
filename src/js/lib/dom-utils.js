import obj from './object';

var DomUtils = {
    /**
     * Get offset of element.
     *
     * @param {DOMElement} el
     * @returns {Object}
     */
    getOffset(el) {
        let box = {top: 0, left: 0};

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
        const div = document.createElement('div');
        let property = false;

        ['Moz', 'Webkit', 'O', 'ms', ''].forEach(function(item) {
            const propertyBuffer = item + (item ? 'T' : 't') + 'ransform';
            if (propertyBuffer in div.style) {
                property = propertyBuffer;
            }
        });

        return property === false ? function(elem, top) {
            elem.style.top = obj.isNumber(top) ? top + 'px' : top;
        } : function(elem, top) {
            elem.style[property] = 'translateY(' + (obj.isNumber(top) ? top + 'px' : top) + ')';
        };
    })()
};

export default DomUtils;
