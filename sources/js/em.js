var elem = function(name, m, val) {
        if(val === null || val === false) {
            name = '';
        } else if(val === true || val === undefined) {
            val = '';
        }
        
        return NS + '__' + name + (m ? '_' + m + (val === '' ? '' : '_' + val) : '');
    },
    mod = function(name, val) {
        if(val === null || val === false) {
            name = '';
        } else if(val === true || val === undefined) {
            val = '';
        }
        
        return NS + '_' + name + (val === '' ? '' : '_' + val);
    },
    delMod = function(el, m) {
        var e = getElemName(el),
            selector = e ? elem(e, m) : mod(m),
            classes = (el.className || '').split(' ');

        classes.forEach(function(cl) {
            if(cl === selector || cl.search(selector + '_') !== -1) {
                removeClass(el, cl);
            }
        });
    },
    setMod = function(el, m, val) {
        var e = getElemName(el);
        delMod(el, m);
        addClass(el, e ? elem(e, m, val) : mod(m, val));
    },
    hasMod = function(el, m, val) {
        var e = getElemName(el);

        return hasClass(el, e ? elem(e, m, val) : mod(m, val));
    },
    hasElem = function(el, e) {
        return hasClass(el, elem(e));
    },
    getElemName = function(el) {
        var buf = el.className.match(/__([^ _$]+)/);
        return buf ? buf[1] : '';
    };

var _Em = {
    _elem: function(e, m, val) {
        return this._container.querySelector('.' + elem(e, m, val));
    },
    /*_elemContext: function(context, e, m, val) {
        return context.querySelector('.' + elem(e, m, val));
    },*/
    _elemAll: function(e, m, val) {
        return this._container.querySelectorAll('.' + elem(e, m, val));
    },
    _elemAllContext: function(context, e, m, val) {
        return context.querySelectorAll('.' + elem(e, m, val));
    }
};

extend(Cln.prototype, _Em);
