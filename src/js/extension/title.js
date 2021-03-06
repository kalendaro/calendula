/**
 * Extension: Title
 */
import { parseDateToObj, parseDateToISO } from '../lib/date';
import { isPlainObj } from '../lib/type';

export default class Title {
    init(data) {
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
        const iso = parseDateToISO(date);
        return iso ? this._title[iso] : null;
    }

    /**
     * Set title by date.
     *
     * @param {Object|Array} data
     */
    set(data) {
        if (Array.isArray(data)) {
            data.forEach(item => this._set(item));
        } else if (isPlainObj(data)) {
            this._set(data);
        }
    }

    _set(data) {
        const
            iso = parseDateToISO(data.date),
            parent = this.parent;

        if (iso) {
            this._title[iso] = {text: data.text, color: data.color};

            if (parent._isInited) {
                const day = parent._findDayByDate(parseDateToObj(data.date));
                day && parent
                    .setMod(day, 'has-title')
                    .setMod(day, 'title-color', data.color);
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
            date.forEach(item => this._remove(item));
        } else {
            this._remove(date);
        }
    }

    _remove(date) {
        const
            parent = this.parent,
            iso = parseDateToISO(date);

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
