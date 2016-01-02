/*
 * Extension: Tooltip
*/
Cln.addExt('tooltip', null, {
    /**
     * Show tooltip.
     * @param {DOMElement} target
     * @param {Object} data
     * @param {string} data.text
     * @param {string} data.color
    */
    show: function(target, data) {
        var dataBuf = data || {},
            margin = 5;

        this._create();
        setMod(this._container, 'theme', this.parent.setting('theme'));
        setMod(this._container, 'visible');

        this._container.querySelector('.calendula__tooltip-text').innerHTML = jshtml({
            c: dataBuf.text,
            e: 'tooltip-row'
        });

        setMod(this._container, 'color', dataBuf.color || 'default');

        this._isOpened = true;

        var offset = getOffset(target),
            x = offset.left - (this._container.offsetWidth - target.offsetWidth) / 2,
            y = offset.top - this._container.offsetHeight - margin;

        setPosition(this._container, {
            left: x,
            top: y
        });
    },
    /**
     * Hide tooltip.
    */
    hide: function() {
        if(this._isOpened) {
            delMod(this._container, 'visible');
            this._isOpened = false;
        }
    },
    /**
     * Destructor.
    */
    destroy: function() {
        if(this._container) {
            this.hide();
            document.body.removeChild(this._container);
            delete this._container;
        }
    },
    _create: function() {
        if(this._container) {
            return;
        }

        var el = document.createElement('div');
        addClass(el, elem('tooltip'));
        el.innerHTML = jshtml([{e: 'tooltip-text'}, {e: 'tooltip-tail'}]);

        document.body.appendChild(el);

        this._container = el;
    }
});
