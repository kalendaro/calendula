function leadZero(num) {
    return (num < 10 ? '0' : '') + num;
}

function ymdToISO(y, m, d) {
    return [y, leadZero(m + 1), leadZero(d)].join('-');
}

function parseDate(value) {
    var date = null,
        match,
        buf;

    if(value) {
        if(isString(value)) {
            if(value === 'today') {
                return new Date();
            }

            match = /^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(value);
            if(match) {
                    buf = [match[3], match[2], match[1]];
            } else {
                match = /^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(value);
                if(match) {
                    buf = [match[1], match[2], match[3]];
                }
            }

            if(buf) {
                date = new Date(parseNum(buf[2]), parseNum(buf[1] - 1), parseNum(buf[0]));
            }
        } else if(isObject(value)) {
            if(value instanceof Date) {
                date = value;
            } else if(value.year && value.day) {
                date = new Date(value.year, value.month - 1, value.day, 12, 0, 0, 0);
            }
        } else if(isNumber(value)) {
            date = new Date(value);
        }
    }

    return date;
}

function parseDateToISO(value) {
    var d = parseDate(value);
    if(d) {
        return [d.getFullYear(), leadZero(d.getMonth() + 1), leadZero(d.getDate())].join('-');
    } else {
        return null;
    }
}

function parseDateToObj(value) {
    var d = parseDate(value);
    if(d) {
        return {
            day: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear()
        };
    } else {
        return {};
    }
}
