import Calendula from '../calendula';

function bem(b, e, m, val) {
    return b + '__' + e + (m ? '_' + m + (val === '' ? '' : '_' + val) : '');
}

Calendula.extend(Calendula.prototype, {
    /**
     * Build CSS class for element.
     *
     * @param {string} e
     * @param {string} [m]
     * @param {string} [val]
     * @returns {string}
     */
    e(e, m, val) {
        if (val === null || val === false) {
            m = '';
        } else if (val === true || val === undefined) {
            val = '';
        }

        return bem(this._name, e, m, val);
    },

    /**
     * Build CSS class for mod.
     *
     * @param {string} m
     * @param {string} [val]
     * @returns {string}
     */
    m(m, val) {
        if (val === null || val === false) {
            m = '';
        } else if (val === true || val === undefined) {
            val = '';
        }

        return bem(this._name, '', m, val);
    },

    /**
     * Remove mod from DOM element.
     *
     * @param {DOMElement} dom
     * @param {string} m
     * @returns {this}
     */
    delMod(dom, m) {
        const
            e = this.getElemName(dom),
            selector = e ? this.e(e, m) : this.m(m),
            classes = (dom.className || '').split(' ');

        classes.forEach((cl) => {
            if (cl === selector || cl.search(selector + '_') !== -1) {
                dom.classList.remove(cl);
            }
        });

        return this;
    },

    /**
     * Set mod for DOM element.
     * @param {DOMElement} dom
     * @param {string} m
     * @param {string|boolean} [val]
     * @returns {this}
     */
    setMod(dom, m, val) {
        const e = this.getElemName(dom);
        this.delMod(dom, m);
        dom.classList.add(e ? this.e(e, m, val) : this.m(m, val));

        return this;
    },

    /**
     * Has a mod?
     *
     * @param {DOMElement} dom
     * @param {string} m
     * @param {string|boolean} [val]
     * @returns {boolean}
     */
    hasMod(dom, m, val) {
        const e = this.getElemName(dom);
        return dom.classList.contains(e ? this.e(e, m, val) : this.m(m, val));
    },

    /**
     * Has a element?
     *
     * @param {DOMElement} dom
     * @param {string} e
     * @returns {boolean}
     */
    hasElem(dom, e) {
        return dom.classList.contains(this.e(e));
    },

    /**
     * Get name for element.
     *
     * @param {DOMElement} dom
     * @returns {string}
     */
    getElemName(dom) {
        const result = dom.className.match(/__([^ _$]+)/);
        return result ? result[1] : '';
    },

    /**
     * Find a element by name.
     *
     * @param {DOMElement} e
     * @param {string} m
     * @param {string|boolean} [val]
     * @returns {string}
     */
    findElem(e, m, val) {
        return this._dom.querySelector('.' + this.e(e, m, val));
    },

    /**
     * Find a element by name in context.
     *
     * @param {DOMElement} dom
     * @param {DOMElement} e
     * @param {string} m
     * @param {string|boolean} [val]
     * @returns {string}
     */
    findElemContext(dom, e, m, val) {
        return dom.querySelector('.' + this.e(e, m, val));
    },

    /**
     * Find all elements by name.
     *
     * @param {DOMElement} dom
     * @param {string} m
     * @param {string|boolean} [val]
     * @returns {string}
     */
    findElemAll(dom, m, val) {
        return this._dom.querySelectorAll('.' + this.e(dom, m, val));
    },

    /**
     * Find all elements by name in context.
     *
     * @param {DOMElement} context
     * @param {string} e
     * @param {string} [m]
     * @param {string|boolean} [val]
     * @returns {string}
     */
    findElemAllContext(context, e, m, val) {
        return context.querySelectorAll('.' + this.e(e, m, val));
    }
});
