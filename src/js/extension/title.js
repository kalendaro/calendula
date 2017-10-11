'use strict';

/**
 * Extension: Title
 */
import mdate from '../lib/date';
import obj from '../lib/object';
import Calendula from '../calendula';

export default class Title {
    constructor(data) {
        this._title = {};
        this.set(data.title);
    }

    /**
     * Get title by date.
     *
     * @param {Date|number|string} date
     * @returns {?Object}
     */
    get(date) {
        const iso = mdate.parseDateToISO(date);
        return iso ? this._title[iso] : null;
    }

    /**
     * Set title by date.
     *
     * @param {Object|Array} data
     */
    set(data) {
        if (Array.isArray(data)) {
            data.forEach(function(item) {
                this._set(item);
            }, this);
        } else if (obj.isPlainObj(data)) {
            this._set(data);
        }
    }

    _set(data) {
        const
            iso = mdate.parseDateToISO(data.date),
            parent = this.parent;

        if (iso) {
            this._title[iso] = {text: data.text, color: data.color};

            if (parent._isInited) {
                const el = parent._findDayByDate(parseDateToObj(data.date));
                el && parent
                    .setMod(el, 'has-title')
                    .setMod(el, 'title-color', data.color);
            }
        }
    }

    /**
     * Remove title.
     *
     * @param {Date|number|string} date
     */
    remove(date) {
        if (Array.isArray(date)) {
            date.forEach(function(el) {
                this._remove(el);
            }, this);
        } else {
            this._remove(date);
        }
    }

    _remove(date) {
        const
            parent = this.parent,
            iso = mdate.parseDateToISO(date);

        if (iso) {
            delete this._title[iso];

            if (parent._isInited) {
                const day = parent._findDayByDate(parseDateToObj(date));
                if (day) {
                    parent
                        .delMod(day, 'has-title')
                        .delMod(day, 'title-color');
                }
            }
        }
    }

    /**
     * Remove all titles.
     */
    removeAll() {
        const parent = this.parent;

        this._title = {};

        if (parent._isInited) {
            const days = parent.findElemAll('day', 'has-title');
            if (days) {
                for (let i = 0; i < days.length; i++) {
                    parent
                        .delMod(days[i], 'has-title')
                        .delMod(days[i], 'title-color');
                }
            }
        }
    }

    destroy() {
        delete this._title;
    }
}

Calendula.addExtension(Title);
