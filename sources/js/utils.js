var elem = function(name, mod, val) {
        if(val === null || val === undefined) {
            val = '';
        }
        
        return NS + '__' + name + (mod ? '_' + mod + (val === '' ? '' : '_' + val) : '');
    },
    mod = function(name, val) {
        if(val === null || val === undefined) {
            val = '';
        }
        
        return NS + '_' + name + (val === '' ? '' : '_' + val);
    },
    div = document.createElement('div'),
    dataAttr = div.dataset ? function(elem, name) {
        return elem.dataset[name];
    } : function(elem, name) { // support IE9
        return elem.getAttribute('data-' + name);
    },
    hasClassList = !!div.classList,
    addClass = hasClassList ? function(elem, name) {
        return elem.classList.add(name);
    } : function(elem, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        if(!re.test(name.className)) {
            elem.className = (elem.className + ' ' + name).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
        }
    },
    removeClass = hasClassList ? function(elem, name) {
        return elem.classList.remove(name);    
    } : function(elem, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        elem.className = elem.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
    },
    hasClass = hasClassList ? function(elem, name) {
        return elem.classList.contains(name);
    } : function(elem, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        return elem.className.search(re) !== -1;
    };

extend(Calendula.prototype, {
    _elem: function(name, mod, val) {
        return this._container.querySelector('.' + elem(name, mod, val));
    },
    _elemContext: function(context, name, mod, val) {
        return context.querySelector('.' + elem(name, mod, val));
    },
    _elemAll: function(name, mod, val) {
        return this._container.querySelectorAll('.' + elem(name, mod, val));
    },
    _elemAllContext: function(context, name, mod, val) {
        return context.querySelectorAll('.' + elem(name, mod, val));
    },
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
