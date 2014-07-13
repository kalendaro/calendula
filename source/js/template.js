Calendula.prototype.template = function(name) {
    return this._templates[name]();
};

Calendula.prototype._templates = {
    prepare: function(text) {
        return text.replace(/\$/g, NS + '__');
    },
    attr: function(name, value) {
        return name === '' || name === null || name === undefined ? '' : ' ' + name + '="' + value + '"';
    },
    days: function(year) {
        var text = '';
        for(var m = 0; m < 12; m++) {
            text += this.month(m, year);
        }
    
        return text;
    },
    weekdays: function() {
        var first = this.parent.text('firstWeekDay') || 0;
        var w = {
            first: first,
            last: !first ? 6 : first - 1,
        };
        
        var n = first;
        for(var i = 0; i < 7; i++) {
            w[n] = i;
            
            n++;
            if(n > 6) {
                n = 0;
            }
        }
        
        return w;
    },
    month: function(m, y) {
        var date = new Date(y, m, 1, 12, 0, 0),
            current = new Date(),
            currentStr = [current.getDate(), current.getMonth(), current.getFullYear()].join('-'),
            par = this.parent,
            weekday = date.getDay(),
            weekdays = this.weekdays(),
            dayIndex = weekdays[weekday],
            month = par.text('months')[m],
            daysMonth = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            className = '',
            text = [],
            isNow = function(day, month, year) {
                return Array.prototype.join.call(arguments, '-') === currentStr;
            };
            
        text.push('<div class="$days-month">');
        
        if(dayIndex < 3) {
            text.push('<div class="$days-title-month">' + month + '</div>');
        }
        
        text.push('<table class="$days-table"><tr>');
        
        if(weekday !== weekdays.first) {
            text.push('<td colspan="' + dayIndex + '" class="$empty">' + (dayIndex < 3 ? '' : '<div class="$days-title-month">' + month + '</div>') + '</td>');
        }
        
        var hasTr,
            title,
            selectedDay = par._val.day,
            selectedMonth = par._val.month,
            selectedYear = par._val.year;
        
        for(var day = 1; day <= daysMonth[m]; day++) {
            title = '';
            hasTr = false;
            date.setDate(day);
            weekday = date.getDay();

            // 0 - Sunday, 6 - Saturday
            className = (weekday === 0 || weekday === 6) ? '$day_holiday' : '$day_weekday';
            
            if(day === selectedDay && m === selectedMonth && y === selectedYear) {
                className += ' $day_selected';
            }
            
            if(isNow(day, m, y)) {
                className += ' $day_now';
                title = par.text('now');
            }
            
            text.push('<td' + this.attr('title', title) + ' class="$day ' + className + '" data-month="' + m + '" data-day="' + day + '">' + day + '</td>');
            if(weekday === weekdays.last) {
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
        var buf = '<div class="$year-selector"><div class="$year-selector-i"></div></div>',
            startYear = this.parent._data.startYear,
            endYear = this.parent._data.endYear;
            
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
        var shortWeekDays = this.parent.text('shortWeekDays'),
            wd = this.parent.text('firstWeekDay') || 0,
            weekdays = '';
            
        this.parent.text('shortWeekDays').forEach(function(el, i, data) {
            weekdays += '<div class="$short-weekdays-cell $short-weekdays-cell_n_' + wd + '"' + this.attr('title', data[wd]) + '>' + data[wd] + '</div>';
            wd++;
            if(wd > 6) { // Saturday
                wd = 0;
            }
        }, this);
        
return this.prepare('\
<div class="$short-weekdays">' + weekdays + '</div>\
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
