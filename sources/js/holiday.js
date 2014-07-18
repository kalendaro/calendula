extend(Calendula, {
    addHolidays: function(lang, data) {
        this._holidays = this._holidays || {};
        this._holidays[lang] = data;
    }
});

Calendula.prototype.getHoliday = function(d, m, y) {
    var lang = this._data.lang,
        c = Calendula._holidays;
        
    return c && c[lang] && c[lang][y] ? c[lang][y][d + '-' + (m + 1)] : undefined;
};
