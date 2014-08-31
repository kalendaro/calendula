function leadZero(num) {
    return (num < 10 ? '0' : '') + num;
}

function isLeapYear(y) {
    if((!(y % 4) && (y % 100)) || !(y % 400)) {
        return true;
    }
    
    return false;
}

extend(Cln.prototype, {
    _parseDate: function(value) {
        var date = null,
            match,
            buf;
        
        if(value) {
            if(typeof value === 'string') {
                match = /^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(value);
                if(match) {
                        buf = [match[3], match[2] - 1, match[1]];
                } else {
                    match = /^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(value);
                    if(match) {
                        buf = [match[1], match[2] - 1, match[3]];
                    }
                }
                
                if(buf) {
                    date = new Date(parseNum(buf[2]), parseNum(buf[1]), parseNum(buf[0]));
                }
            } else if(typeof value === 'object') {
                if(value instanceof Date) {
                    date = value;
                } else if(value.year && value.day) {
                    date = new Date(value.year, value.month - 1, value.day, 12, 0, 0, 0);
                }
            } else if(typeof number === 'number') {
                date = new Date(value);
            }
        }
        
        return date;
    },
    _parseDateToObj: function(value) {
        var d = this._parseDate(value);
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
});
