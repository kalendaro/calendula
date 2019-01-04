import Calendula from './calendula';

const holidays = {};

/**
 * Add holidays.
 *
 * @param {string} locale
 * @param {Object} data
 */
Calendula.addHolidays = function(locale, data) {
    holidays[locale] = data;
};

/**
 * Get data for holiday by date.
 *
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {number|undefined}
 */
Calendula.prototype.getHoliday = function(day, month, year) {
    const locale = this._data.locale;

    return holidays[locale] && holidays[locale][year] ?
        holidays[locale][year][day + '-' + (month + 1)] :
        undefined;
};
