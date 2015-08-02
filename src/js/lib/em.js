var NS = 'calendula';

/**
 * Build CSS class for bem-element.
 * @param {string} name - Bem-element name.
 * @param {string} [m] - Mod name.
 * @param {string} [val] - Mod value.
 * @return {string}
 */
function elem(name, m, val) {
    if(val === null || val === false) {
        m = '';
    } else if(val === true || val === undefined) {
        val = '';
    }

    return NS + '__' + name + (m ? '_' + m + (val === '' ? '' : '_' + val) : '');
}

/**
 * Build CSS class for bem-mod.
 * @param {string} name - Mod name.
 * @param {string} [val] - Mod value.
 * @return {string}
 */
function mod(name, val) {
    if(val === null || val === false) {
        name = '';
    } else if(val === true || val === undefined) {
        val = '';
    }

    return NS + (name ? '_' + name + (val === '' ? '' : '_' + val) : '');
}

/**
 * Remove bem-mod from DOM element.
 * @param {Element} el
 * @param {string} m - Mod name.
 */
function delMod(el, m) {
    var e = getElemName(el),
        selector = e ? elem(e, m) : mod(m),
        classes = (el.className || '').split(' ');

    classes.forEach(function(cl) {
        if(cl === selector || cl.search(selector + '_') !== -1) {
            removeClass(el, cl);
        }
    });
}

/**
 * Set bem-mod for DOM element.
 * @param {Element} el
 * @param {string} m - Mod name.
 * @param {string} [val] - Mod value.
 */
function setMod(el, m, val) {
    var e = getElemName(el);
    delMod(el, m);
    addClass(el, e ? elem(e, m, val) : mod(m, val));
}

/**
 * Has bem-mod for DOM element?
 * @param {Element} el
 * @param {string} m - Mod name.
 * @param {string} [val] - Mod value.
 */
function hasMod(el, m, val) {
    var e = getElemName(el);

    return hasClass(el, e ? elem(e, m, val) : mod(m, val));
}

/**
 * Has bem-element?
 * @param {Element} el
 * @param {string} e - Element name.
 * @return {boolean}
 */
function hasElem(el, e) {
    return hasClass(el, elem(e));
}

/**
 * Get bem-element name.
 * @param {Element} el
 * @return {string}
 */
function getElemName(el) {
    var buf = el.className.match(/__([^ _$]+)/);
    return buf ? buf[1] : '';
}
