extend(Cln, {
    addHolidays: function(locale, data) {
        this._holidays = this._holidays || {};
        this._holidays[locale] = data;
    }
});

Cln.prototype.getHoliday = function(day, month, year) {
    var locale = this._data.locale,
        c = Cln._holidays;
        
    return c && c[locale] && c[locale][year] ? c[locale][year][day + '-' + (month + 1)] : undefined;
};
