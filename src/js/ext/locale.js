extend(Cln, {
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

Cln.prototype.text = function(id) {
    return Cln._texts[this._data.locale][id];
};
