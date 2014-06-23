Calendula.prototype._texts = {};
Calendula.prototype._langs = [];

Calendula.prototype.addLocale = function(lang, texts) {
    this.lang = lang;
    this._langs.push(lang);
    
    this._texts[lang] = texts;
};

Calendula.prototype.text = function(id) {
    return this._texts[this.lang][id];
};