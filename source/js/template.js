Calendula.prototype.template = function(name) {
    return this._templates[name]();
};

Calendula.prototype._templates = {
    _prepare: function(text) {
        return text.replace(/\$/g, NS + '__');
    },
    daysMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    days: function(year) {
        var text = '';
        for(var m = 0; m < this.daysMonth.length; m++) {
            text += this.month(m, year);
        }
    
        return text;
    },
    month: function(m, y) {
        var date = new Date(y, m, 1, 12, 0, 0),
            current = new Date(),
            currentStr = [current.getDate(), current.getMonth(), current.getFullYear()].join('-'),
            weekday = date.getDay() - 1,
            FEBRARY = 1,
            SATURDAY = 5,
            SUNDAY = 6,
            month = this.parent.text('months')[m],
            className = '',
            text = [],
            isNow = function(day, month, year) {
                return Array.prototype.join.call(arguments, '-') === currentStr;
            };
            
        if (isLeapYear(y)) {
            this.daysMonth[FEBRARY] = 29;
        } else {
            this.daysMonth[FEBRARY] = 28;
        }
            
        text.push('<div class="$days-month">');
        
        if (weekday === -1) {
            weekday = SUNDAY;
        }
        
        if(weekday < 3) {
            text.push('<div class="$days-title-month">' + month + '</div>');
        }
        
        text.push('<table class="$days-table"><tr>');
        if(weekday > 0) {
            text.push('<td colspan="' + weekday + '" class="$empty">' + (weekday < 3 ? '' : '<div class="$days-title-month">' + month + '</div>') + '</td>');
        }
        
        var hasTr,
            title,
            selectedDay = this.parent._val.day,
            selectedMonth = this.parent._val.month,
            selectedYear = this.parent._val.year;
        
        for (var day = 1; day <= this.daysMonth[m]; day++) {
            title = '';
            hasTr = false;
            date.setDate(day);
            weekday = date.getDay() - 1;
            
            if (weekday == -1) {
                weekday = SUNDAY;
            }
            
            if (weekday !== SUNDAY && weekday !== SATURDAY) {
                className = '$day_weekday';
            } else {
                className = '$day_holiday';
            }
            
            if (day === selectedDay && m === selectedMonth && y === selectedYear) {
                className += ' $day_selected';
            }
            
            if (isNow(day, m, y)) {
                className += ' $day_now';
                title = this.parent.text('now');
            }
            
            text.push('<td' + (title ? ' title="' + title + '"' : '') + ' class="$day ' + className + '" data-month="' + m + '" data-day="' + day + '">' + day + '</td>');
            if(weekday === SUNDAY) {
                text.push('</tr>');
                hasTr = true;
            }
        }
            
        if(!hasTr) {
            text.push('</tr>');
        }
        
        text.push('</table></div>');
        
        return text.join('');
    },
    years: function() {
        var buf = '<div class="$year-selector"><div class="$year-selector-i"></div></div>';
        var startYear = this.parent._data.startYear;
        var endYear = this.parent._data.endYear;
        for(var i = startYear; i <= endYear; i++) {
            buf += '<div class="$year" data-year="' + i + '">' + i + '</div>';
        }
        
        return buf;
    },
    months: function() {
        var buf = '<div class="$month-selector"><div class="$month-selector-i"></div></div>';
        this.parent.text('months').forEach(function(el, i) {
            buf += '<div class="$month" data-month="' + i + '">' + el + '</div>';
        });
        
        return buf;
    },
    main: function() {
        var weekdays = '';
        this.parent.text('shortWeekDays').forEach(function(el, i) {
            weekdays += '<td class="$short-weekdays-cell $short-weekdays-cell_n_' + i + '">' + el + '</td>';
        });
        
return this._prepare('\
<table class="$short-weekdays">' + weekdays + '</table>\
<div class="$container">\
<div class="$days">\
    <div class="$days-container">' + this.days(this.parent._currentDate.year) + '</div>\
</div>\
<div class="$months">' + this.months() + '</div>\
<div class="$years">' + this.years() + '</div>\
</div>\
');
    }
};
