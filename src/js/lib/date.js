import obj from './object';

var MDate = {
    /**
     * Add a leading zero.
     * @param {number} value
     * @return {string}
     */
    leadZero(value) {
        return (value < 10 ? '0' : '') + value;
    },

    /**
     * Convert a date to ISO format.
     *
     * @param {number} year
     * @param {number} month - 0-11
     * @param {number} day
     * @returns {string}
     */
    ymdToISO(year, month, day) {
        return [year, MDate.leadZero(month + 1), MDate.leadZero(day)].join('-');
    },

    /**
     * Parse a date.
     *
     * @param {string|number|Date} value
     * @returns {Date}
     */
    parseDate(value) {
        var date = null,
            match,
            buf;

        if (value) {
            if (obj.isString(value)) {
                if (value === 'today') {
                    return new Date();
                }

                match = /^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(value);
                if (match) {
                        buf = [match[3], match[2], match[1]];
                } else {
                    match = /^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(value);
                    if (match) {
                        buf = [match[1], match[2], match[3]];
                    }
                }

                if (buf) {
                    date = new Date(parseInt(buf[2], 10), parseInt(buf[1] - 1, 10), parseInt(buf[0], 10));
                }
            } else if (obj.isObject(value)) {
                if (value instanceof Date) {
                    date = value;
                } else if (value.year && value.day) {
                    date = new Date(value.year, value.month, value.day, 12, 0, 0, 0);
                }
            } else if (obj.isNumber(value)) {
                date = new Date(value);
            }
        }

        return date;
    },

    /**
     * Parse a date and convert to ISO format.
     *
     * @param {string|number|Date} value
     * @returns {string|null}
     */
    parseDateToISO(value) {
        var date = MDate.parseDate(value);
        return date ? 
            [
                date.getFullYear(),
                MDate.leadZero(date.getMonth() + 1),
                MDate.leadZero(date.getDate())
            ].join('-') :
            null;
    },

    /**
     * Convert a date to a object.
     *
     * @param {string|number|Date} value
     * @returns {Object}
     */
    parseDateToObj(value) {
        var date = MDate.parseDate(value);
        return date ? {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
        } : {};
    }
};

export default MDate;
