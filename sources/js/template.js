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
        for(var m = MIN_MONTH; m <= MAX_MONTH; m++) {
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
        var date = new Date(y, m, 1, 12, 0, 0, 0),
            dateTs = date.getTime(),
            current = new Date(),
            isSelected = function(d, m, y) {
                var val = par._val;
                return d === val.day && m === val.month && y === val.year;
            },
            getTs = function(d) {
                if(!d.year) {
                    return null;
                }
                
                return new Date(d.year, d.month, d.day, 12, 0, 0, 0).getTime();
            };
            
        current.setHours(12);
        current.setMinutes(0);
        current.setSeconds(0);
        current.setMilliseconds(0);
        
        var par = this.parent,
            weekday = date.getDay(),
            weekdays = this.weekdays(),
            dayIndex = weekdays[weekday],
            month = par.text('months')[m],
            daysMonth = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            minTs = getTs(this.parent.setting('min')),
            maxTs = getTs(this.parent.setting('max')),
            currentTs = current.getTime(),
            hasTr,
            title,
            holiday,
            className,
            text = [];
            
        text.push('<div class="$days-month">');
        
        if(dayIndex < 3) {
            text.push('<div class="$days-title-month">' + month + '</div>');
        }
        
        text.push('<table class="$days-table"><tr>');
        
        if(weekday !== weekdays.first) {
            text.push('<td colspan="' + dayIndex + '" class="$empty">' + (dayIndex < 3 ? '' : '<div class="$days-title-month">' + month + '</div>') + '</td>');
        }
        
        for(var day = 1; day <= daysMonth[m]; day++) {
            title = '';
            hasTr = false;
            date.setDate(day);
            weekday = date.getDay();
            holiday = this.parent.getHoliday(day, m, y);
            className = ['$day'];

            // 0 - Sunday, 6 - Saturday
            className.push((weekday === 0 || weekday === 6) ? '$day_holiday' : '$day_workday');
            if(holiday === 0) {
                className.push('$day_nonholiday');
            } else if(holiday === 1) {
                className.push('$day_highday');
            }
            
            if(isSelected(day, m, y)) {
                className.push('$day_selected');
            }
            
            if(currentTs === dateTs) {
                className.push('$day_now');
                title = par.text('today');
            }
            
            if((minTs && dateTs < minTs) || (maxTs && dateTs > maxTs)) {
                className.push('$day_minmax');
            }
            
            text.push('<td' + this.attr('title', title) + ' class="' + className.join(' ') + '" data-month="' + m + '" data-day="' + day + '">' + day + '</td>');
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
            startYear = this.parent._data._startYear,
            endYear = this.parent._data._endYear;
            
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
<div class="$years"><div class="$years-container">' + this.years() + '</div></div>\
</div>\
');
    }
};
