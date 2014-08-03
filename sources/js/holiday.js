extend(Calendula, {
    addHolidays: function(locale, data) {
        this._holidays = this._holidays || {};
        this._holidays[locale] = data;
    }
});

Calendula.prototype.getHoliday = function(d, m, y) {
    var locale = this._data.locale,
        c = Calendula._holidays;
        
    return c && c[locale] && c[locale][y] ? c[locale][y][d + '-' + (m + 1)] : undefined;
};
