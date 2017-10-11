'use strict';

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
Calendula.prototype.getHoliday = function(day, month, year) {
    const
        locale = this._data.locale,
        c = Calendula._holidays;

    return c && c[locale] && c[locale][year] ? c[locale][year][day + '-' + (month + 1)] : undefined;
};
