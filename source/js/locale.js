Calendula._texts = {};
Calendula._langs = [];

Calendula.addLocale = function(lang, texts) {
    this._langs.push(lang);
    this._texts[lang] = texts;
};

Calendula.prototype.text = function(id) {
    return Calendula._texts[this._prefs.lang][id];
};

Calendula.text = function(lang, id) {
    return Calendula._texts[lang][id];
};