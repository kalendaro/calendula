Cln.extend(Cln, {
    _locales: [],
    _texts: {},
    /**
     * Add a locale.
     * @param {string} locale
     * @param {Object} texts
     */
    addLocale: function(locale, texts) {
        this._locales.push(locale);
        this._texts[locale] = texts;
        
        if(texts.def) {
            this._defaultLocale = locale;
        }
    }
});

/**
 * Get text by id for current locale.
 * @param {string} id
 * @return {*}
 */
Cln.prototype.text = function(id) {
    return Cln._texts[this._data.locale][id];
};
