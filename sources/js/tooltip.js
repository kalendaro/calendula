function Tooltip() {}

extend(Tooltip.prototype, {
    create: function() {
        if(this._container) {
            return;
        }

        var el = document.createElement('div');
        addClass(el, elem('tooltip'));
        el.innerHTML = jshtml([{e: 'tooltip-text'}, {e: 'tooltip-tail'}])

        document.body.appendChild(el);

        this._container = el;
    },
    show: function(target, data) {
        var dataBuf = data || {};

        this.create();
        setMod(this._container, 'theme', this.parent.setting('theme'));
        setMod(this._container, 'visible');

        this._elem('tooltip-text').innerHTML = jshtml({c: dataBuf.text, e: 'tooltip-row'});

        setMod(this._container, 'color', dataBuf.color || 'default');

        this._isOpened = true;

        var offset = getOffset(target),
            x = offset.left - (this._container.offsetWidth - target.offsetWidth) / 2,
            y = offset.top - this._container.offsetHeight - 5;

        setPosition(this._container, x, y);
    },
    hide: function() {
        if(this._isOpened) {
            delMod(this._container, 'visible');
            this._isOpened = false;
        }
    },
    destroy: function() {
        if(this._container) {
            this.hide();
            document.body.removeChild(this._container);
            delete this._container;
        }
    }
});
