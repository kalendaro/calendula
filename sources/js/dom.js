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

extend(Cln.prototype, {
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
    }
});
