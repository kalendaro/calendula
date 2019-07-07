import Calendula from './calendula';

const locales = {};

/**
 * Add a locale.
 * @param {Object} data
 */
Calendula.addLocale = function(data) {
    locales[data.locale] = data;
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
Calendula.prototype.i18n = function(id) {
    return locales[this.setting('locale')][id];
};
