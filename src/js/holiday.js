import Calendula from './calendula';

Calendula.extend(Calendula, {
    /**
     * Add holidays.
     *
     * @param {string} locale
     * @param {Object} data
     */
    addHolidays(locale, data) {
        this._holidays = this._holidays || {};
        this._holidays[locale] = data;
    }
});

/**
 * Get data for holiday by date.
 *
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {number|undefined}
 */
Calendula.prototype.getHoliday = (day, month, year) => {
    const
        locale = this._data.locale,
        holidays = Calendula._holidays;

    return holidays && holidays[locale] && holidays[locale][year] ?
        holidays[locale][year][day + '-' + (month + 1)] :
        undefined;
};
