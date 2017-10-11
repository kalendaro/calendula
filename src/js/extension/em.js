import Calendula from '../calendula';

Calendula.extend(Calendula.prototype, {
    /**
     * Build CSS class for element.
     *
     * @param {string} name
     * @param {string} [m]
     * @param {string} [val]
     * @returns {string}
     */
    e(name, m, val) {
        if (val === null || val === false) {
            m = '';
        } else if (val === true || val === undefined) {
            val = '';
        }

        return this._name + '__' + name + (m ? '_' + m + (val === '' ? '' : '_' + val) : '');
    },

    /**
     * Build CSS class for mod.
     *
     * @param {string} name
     * @param {string} [val]
     * @returns {string}
     */
    m(name, val) {
        if (val === null || val === false) {
            name = '';
        } else if (val === true || val === undefined) {
            val = '';
        }

        return this._name + (name ? '_' + name + (val === '' ? '' : '_' + val) : '');
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
            elem = this.getElemName(dom),
            selector = elem ? this.e(elem, m) : this.m(m),
            classes = (dom.className || '').split(' ');

        classes.forEach(function(cl) {
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
        const elem = this.getElemName(dom);
        this.delMod(dom, m);
        dom.classList.add(elem ? this.e(elem, m, val) : this.m(m, val));
        
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
        const elem = this.getElemName(dom);
        return dom.classList.contains(elem ? this.e(elem, m, val) : this.m(m, val));
    },

    /**
     * Has a element?
     *
     * @param {DOMElement} dom
     * @param {string} elem
     * @returns {boolean}
     */
    hasElem(dom, elem) {
        return dom.classList.contains(this.e(elem));
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
     * @param {DOMElement} e
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
     * @param {DOMElement} el
     * @param {string} m
     * @param {string|boolean} [val]
     * @returns {string}
     */
    findElemAll(e, m, val) {
        return this._dom.querySelectorAll('.' + this.e(e, m, val));
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
