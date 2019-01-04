import { isUndefined, isNumber } from './type';

/**
 * Get offset of element.
 *
 * @param {DOMElement} el
 * @returns {Object}
 */
export function getOffset(el) {
    let box = {top: 0, left: 0};

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (el && !isUndefined(el.getBoundingClientRect)) {
        box = el.getBoundingClientRect();
    }

    return {
        top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
        left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
    };
}

/**
 * Set position of element.
 *
 * @param {DOMElement} elem
 * @param {Object} coords
 * @param {string|number} coords.left
 * @param {string|number} coords.top
 */
export function setPosition(elem, coords) {
    const left = coords.left;
    const top = coords.top;

    elem.style.left = isNumber(left) ? left + 'px' : left;
    elem.style.top = isNumber(top) ? top + 'px' : top;
}

/**
 * Set translateY.
 *
 * @param {DOMElement} el
 * @param {string|number} top
 */
export function setTranslateY(el, top) {
    el.style.top = 'translateY(' + (isNumber(top) ? top + 'px' : top) + ')';
}

/**
 * Get window area.
 *
 * @returns {Object}
 */
export function getWindowArea() {
    const
        docElement = document.documentElement,
        pageX = window.pageXOffset,
        pageY = window.pageYOffset;

    return {
        x1: pageX,
        y1: pageY,
        x2: pageX + docElement.clientWidth,
        y2: pageY + docElement.clientHeight
    };
}
