var SATURDAY = 6,
    SUNDAY = 0;

extend(Cln.prototype, {
    template: function(name) {
        var t = this._templates;
        return t._prepare(jshtml(t[name]()));
    },
    _templates: {
        _prepare: function(str) {
            return str.replace(/\$/g, NS + '__');
        },
        days: function() {
            var buf = [];

            for(var m = MIN_MONTH; m <= MAX_MONTH; m++) {
                buf.push(this.month(m, this.parent._currentDate.year));
            }

            return buf;
        },
        weekdays: function() {
            var first = this.parent.text('firstWeekDay') || 0;
            var w = {
                first: first,
                last: !first ? SATURDAY : first - 1
            };

            var n = first;
            for(var i = 0; i < 7; i++) {
                w[n] = i;

                n++;
                if(n > SATURDAY) {
                    n = SUNDAY;
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
                },
                getTitleMonth = function() {
                    var getValue = function(setting) {
                            return parseNum('' + setting.year + leadZero(setting.month));
                        },
                        min = getValue(minSetting),
                        max = getValue(maxSetting),
                        cur = parseNum('' + y + leadZero(m)),
                        clMinMax = '';

                    if((minSetting && cur < min) || (maxSetting && cur > max)) {
                        clMinMax = '$days-title-month_minmax';
                    }

                    return {
                        cl: ['$days-title-month', clMinMax],
                        c: month
                    };
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
                minSetting = par.setting('min'),
                maxSetting = par.setting('max'),
                minTs = getTs(minSetting),
                maxTs = getTs(maxSetting),
                currentTs = current.getTime(),
                title,
                holiday,
                className,
                objFirstRow = {
                    t: 'tr',
                    c: [
                        weekday !== weekdays.first ? {
                            t: 'td',
                            colspan: dayIndex,
                            cl: '$empty',
                            c: dayIndex < 3 ? '' : getTitleMonth()
                        } : ''
                    ]
                },
                objRow = objFirstRow,
                obj = {
                    cl: '$days-month',
                    c: [
                        dayIndex < 3 ? getTitleMonth() : '',
                        {
                            t: 'table',
                            cl: '$days-table',
                            c: [objRow]
                        }
                    ]
                };

            for(var day = 1; day <= daysMonth[m]; day++) {
                title = '';
                date.setDate(day);
                weekday = date.getDay();
                holiday = this.parent.getHoliday(day, m, y);
                className = [
                    '$day',
                    (weekday === SUNDAY || weekday === SATURDAY) ? '$day_holiday' : '$day_workday'
                ];

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

                if(weekday === weekdays.first) {
                    objRow = {
                        t: 'tr',
                        c: []
                    };

                    obj.c[1].c.push(objRow);
                }

                objRow.c.push({
                    t: 'td',
                    cl: className,
                    title: title,
                    'data-month': m,
                    'data-day': day,
                    c: day
                });
            }

            return obj;
        },
        years: function() {
            var data = this.parent._data,
                startYear = data._startYear,
                endYear = data._endYear,
                buf = [{
                    cl: '$year-selector',
                    c: {
                        cl: '$year-selector-i'
                    }
                }];

            for(var i = startYear; i <= endYear; i++) {
                buf.push({
                    cl: '$year',
                    'data-year': i,
                    c: i
                });
             }

            return buf;
        },
        months: function() {
            var buf = [{
                cl: '$month-selector',
                c: {
                    cl: '$month-selector-i'
                }
            }];

            this.parent.text('months').forEach(function(el, i) {
                buf.push({
                    cl: '$month',
                    'data-month': i,
                    c: el
                });
            });

            return buf;
        },
        main: function() {
            var wd = this.parent.text('firstWeekDay') || SUNDAY,
                weekdays = [];

            this.parent.text('shortWeekDays').forEach(function(el, i, data) {
                weekdays.push({
                    cl: ['$short-weekdays-cell', '$short-weekdays-cell_n_' + wd],
                    title: data[wd],
                    c: data[wd]
                });

                wd++;
                if(wd > SATURDAY) {
                    wd = SUNDAY;
                }
            }, this);

            return [
                {
                    cl: '$short-weekdays',
                    c: weekdays
                }, {
                    cl: '$container',
                    c: [{
                            cl: '$days',
                            c: {
                                cl: '$days-container',
                                c: this.days()
                            }
                        },
                        {
                            cl: '$months',
                            c: this.months()
                        },
                        {
                            cl: '$years',
                            c: {
                                cl: '$years-container',
                                c: this.years()
                            }
                        }
                    ]
                }
            ];
        }
    }
});
