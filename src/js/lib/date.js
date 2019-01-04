import { isNumber, isObject, isString } from './type';

/**
 * Add a leading zero.
 *
 * @param {number} value
 * @returns {string}
 */
export function leadZero(value) {
    return (value < 10 ? '0' : '') + value;
}

/**
 * Convert a date to ISO format.
 *
 * @param {number} year
 * @param {number} month - 0-11
 * @param {number} day
 * @returns {string}
 */
export function ymdToISO(year, month, day) {
    return [year, leadZero(month + 1), leadZero(day)].join('-');
}

/**
 * Parse a date.
 *
 * @param {string|number|Date} value
 * @returns {Date}
 */
export function parseDate(value) {
    let
        date = null,
        match,
        buffer;

    if (value) {
        if (isString(value)) {
            if (value === 'today') {
                return new Date();
            }

            match = /^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(value);
            if (match) {
                buffer = [match[3], match[2], match[1]];
            } else {
                match = /^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(value);
                if (match) {
                    buffer = [match[1], match[2], match[3]];
                }
            }

            if (buffer) {
                date = new Date(parseInt(buffer[2], 10), parseInt(buffer[1] - 1, 10), parseInt(buffer[0], 10));
            }
        } else if (isObject(value)) {
            if (value instanceof Date) {
                date = value;
            } else if (value.year && value.day) {
                date = new Date(value.year, value.month, value.day, 12, 0, 0, 0);
            }
        } else if (isNumber(value)) {
            date = new Date(value);
        }
    }

    return date;
}

/**
 * Parse a date and convert to ISO format.
 *
 * @param {string|number|Date} value
 * @returns {string|null}
 */
export function parseDateToISO(value) {
    const date = parseDate(value);
    return date ?
        [
            date.getFullYear(),
            leadZero(date.getMonth() + 1),
            leadZero(date.getDate())
        ].join('-') :
        null;
}

/**
 * Convert a date to a object.
 *
 * @param {string|number|Date} value
 * @returns {Object}
 */
export function parseDateToObj(value) {
    const date = parseDate(value);
    return date ? {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    } : {};
}

/**
 * Get current date.
 *
 * @returns {Object}
 */
export function getCurrentDate() {
    const date = new Date();

    return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    };
}
