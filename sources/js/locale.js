extend(Calendula, {
    _texts: {},
    _locales: [],
    addLocale: function(locale, texts) {
        this._locales.push(locale);
        this._texts[locale] = texts;
        
        if(texts.def) {
            this._defaultLocale = locale;
        }
    }
});

Calendula.prototype.text = function(id) {
    return Calendula._texts[this._data.locale][id];
};
