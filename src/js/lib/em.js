function elem(name, m, val) {
    if(val === null || val === false) {
        name = '';
    } else if(val === true || val === undefined) {
        val = '';
    }

    return NS + '__' + name + (m ? '_' + m + (val === '' ? '' : '_' + val) : '');
}

function mod(name, val) {
    if(val === null || val === false) {
        name = '';
    } else if(val === true || val === undefined) {
        val = '';
    }

    return NS + '_' + name + (val === '' ? '' : '_' + val);
}

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

function setMod(el, m, val) {
    var e = getElemName(el);
    delMod(el, m);
    addClass(el, e ? elem(e, m, val) : mod(m, val));
}

function hasMod(el, m, val) {
    var e = getElemName(el);

    return hasClass(el, e ? elem(e, m, val) : mod(m, val));
}

function hasElem(el, e) {
    return hasClass(el, elem(e));
}

function getElemName(el) {
    var buf = el.className.match(/__([^ _$]+)/);
    return buf ? buf[1] : '';
}
