extend(Cln, {
    /**
     * Add holidays.
     * @param {string} locale
     * @param {Object} data
     */
    addHolidays: function(locale, data) {
        this._holidays = this._holidays || {};
        this._holidays[locale] = data;
    }
});

/**
 * Get data for holiday by date.
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @return {number|undefined}
 */
Cln.prototype.getHoliday = function(day, month, year) {
    var locale = this._data.locale,
        c = Cln._holidays;

    return c && c[locale] && c[locale][year] ? c[locale][year][day + '-' + (month + 1)] : undefined;
};
