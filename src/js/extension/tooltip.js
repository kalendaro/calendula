/**
 * Extension: Tooltip
 */
import { getOffset, setPosition } from '../lib/dom-utils';
import jstohtml from '../jstohtml';

export default class Tooltip {
    /**
     * Show tooltip.
     * @param {DOMElement} target
     * @param {Object} data
     * @param {string} data.text
     * @param {string} data.color
     */
    show(target, data) {
        this._create();

        data = data || {};

        const
            parent = this.parent,
            margin = 5,
            dom = this._dom;

        parent
            .setMod(dom, 'theme', parent.setting('theme'))
            .setMod(dom, 'visible')
            .setMod(dom, 'color', data.color || 'default');

        parent.findElemContext(dom, 'tooltip-text').innerHTML = jstohtml({
            b: this.parent._name,
            e: 'tooltip-row',
            c: data.text
        });

        const offset = getOffset(target);
        setPosition(dom, {
            left: offset.left - (dom.offsetWidth - target.offsetWidth) / 2,
            top: offset.top - dom.offsetHeight - margin
        });

        this._isOpened = true;
    }

    /**
     * Hide tooltip.
     */
    hide() {
        if (this._isOpened) {
            this.parent.delMod(this._dom, 'visible');
            this._isOpened = false;
        }
    }

    _create() {
        if (this._dom) { return; }

        const
            elem = document.createElement('div'),
            parent = this.parent,
            b = parent._name;

        elem.classList.add(parent.e('tooltip'));
        elem.innerHTML = jstohtml([
            {b, e: 'tooltip-text'},
            {b, e: 'tooltip-tail'}
        ]);

        document.body.appendChild(elem);

        this._dom = elem;
    }

    destroy() {
        if (this._dom) {
            this.hide();
            document.body.removeChild(this._dom);

            delete this._dom;
        }
    }
}
