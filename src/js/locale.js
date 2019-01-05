import Calendula from './calendula';

const locales = {};

/**
 * Add a locale.
 * @param {string} locale
 * @param {Object} texts
 */
Calendula.addLocale = function(locale, texts) {
    locales[locale] = texts;
};

/**
 * Get locales.
 * @returns {Object[]}
 */
Calendula.getLocales = function() {
    return Object.keys(locales);
};


/**
 * Get text by id for current locale.
 *
 * @param {string} id
 * @returns {*}
 */
Calendula.prototype.text = function(id) {
    return locales[this.setting('locale')][id];
};
