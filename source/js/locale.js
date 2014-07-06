extend(Calendula, {
    _texts: {},
    _langs: [],
    addLocale: function(lang, texts) {
        this._langs.push(lang);
        this._texts[lang] = texts;
        
        if(texts.def) {
            this._default = lang;
        }
    }
});

Calendula.prototype.text = function(id) {
    return Calendula._texts[this._data.lang][id];
};
