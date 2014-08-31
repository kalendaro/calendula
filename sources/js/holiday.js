extend(Cln, {
    addHolidays: function(locale, data) {
        this._holidays = this._holidays || {};
        this._holidays[locale] = data;
    }
});

Cln.prototype.getHoliday = function(d, m, y) {
    var locale = this._data.locale,
        c = Cln._holidays;
        
    return c && c[locale] && c[locale][y] ? c[locale][y][d + '-' + (m + 1)] : undefined;
};
