import Calendula from './calendula';

Calendula.extend(Calendula, {
    _locales: [],
    _texts: {},
    /**
     * Add a locale.
     * @param {string} locale
     * @param {Object} texts
     */
    addLocale(locale, texts) {
        this._locales.push(locale);
        this._texts[locale] = texts;

        if (texts.def) {
            this._defaultLocale = locale;
        }
    }
});

/**
 * Get text by id for current locale.
 *
 * @param {string} id
 * @returns {*}
 */
Calendula.prototype.text = (id) => {
    return Calendula._texts[this._data.locale][id];
};
