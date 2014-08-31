var jshtml = (function() {
    var buildItem = function(data) {
        if(data === null || data === undefined) {
            return '';
        }

        var buf = [];

        if(isPlainObj(data)) {
            return tag(data);
        } else if(isArray(data)) {
            for(var i = 0, len = data.length; i < len; i++) {
                buf.push(buildItem(data[i]));
            }

            return buf.join('');
        } else {
            return '' + data;
        }
    };

    var tag = function(data) {
        var t = data.t || 'div',
            text = '<' + t + attrs(data) + '>';

        if(data.c) {
            text += buildItem(data.c);
        }

        text += '</' + t + '>';

        return text;
    };

    var attrs = function(data) {
        var keys = Object.keys(data),
            ignoredItems = ['cl', 'class', 'c', 't'],
            cl = data['cl'] || data['class'],
            text = [],
            buf = '';

        if(cl) {
            text.push(attr('class', cl));
        }

        for(var i = 0, len = keys.length; i < len; i++) {
            var item = keys[i];
            if(ignoredItems.indexOf(item) === -1) {
                text.push(attr(item, data[item]));
            }
        }

        buf = text.join(' ');

        return buf ? ' ' + buf : '';
    };

    var attr = function(name, value) {
        return value !== null && value !== undefined ?
            name + '="' + (isArray(value) ? value.join(' ') : value) + '"' : '';
    };

    return buildItem;
})();
