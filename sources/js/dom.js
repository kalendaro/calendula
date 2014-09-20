var div = document.createElement('div'),
    dataAttr = div.dataset ? function(el, name) {
        return el.dataset[name];
    } : function(el, name) { // support IE9
        return el.getAttribute('data-' + name);
    },
    hasClassList = !!div.classList,
    addClass = hasClassList ? function(el, name) {
        return el.classList.add(name);
    } : function(el, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        if(!re.test(name.className)) {
            el.className = (el.className + ' ' + name).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
        }
    },
    removeClass = hasClassList ? function(el, name) {
        return el.classList.remove(name);    
    } : function(el, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        el.className = el.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
    },
    hasClass = hasClassList ? function(el, name) {
        return el.classList.contains(name);
    } : function(el, name) { // support IE9
        var re = new RegExp('(^|\\s)' + name + '(\\s|$)', 'g');
        return el.className.search(re) !== -1;
    };
