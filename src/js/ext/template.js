var SATURDAY = 6,
    SUNDAY = 0;

function Template() {}

extend(Template.prototype, {
    get: function(name) {
        return jshtml(this[name]());
    },
    days: function() {
        var buf = [];

        for(var m = MIN_MONTH; m <= MAX_MONTH; m++) {
            buf.push(this.month(m, this.parent._currentDate.year));
        }

        return buf;
    },
    dayNames: function() {
        var first = this.parent.text('firstWeekday') || 0,
            w = {
                first: first,
                last: !first ? SATURDAY : first - 1
            },
            n = first;

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
                    mods = {},
                    cur = parseNum('' + y + leadZero(m));

                if((minSetting && cur < min) || (maxSetting && cur > max)) {
                    mods.minmax = true;
                }

                return {
                    e: 'days-title-month',
                    m: mods,
                    c: month
                };
            };

        current.setHours(12);
        current.setMinutes(0);
        current.setSeconds(0);
        current.setMilliseconds(0);

        var par = this.parent,
            weekday = date.getDay(),
            dayNames = this.dayNames(),
            dayIndex = dayNames[weekday],
            month = par.text('months')[m],
            daysMonth = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            minSetting = par.setting('min'),
            maxSetting = par.setting('max'),
            minTs = getTs(minSetting),
            maxTs = getTs(maxSetting),
            currentTs = current.getTime(),
            title,
            holiday,
            mods,
            objFirstRow = {
                t: 'tr',
                c: [
                    weekday !== dayNames.first ? {
                        t: 'td',
                        colspan: dayIndex,
                        e: 'empty',
                        c: dayIndex < 3 ? '' : getTitleMonth()
                    } : ''
                ]
            },
            objRow = objFirstRow,
            obj = {
                e: 'days-month',
                c: [
                    dayIndex < 3 ? getTitleMonth() : '',
                    {
                        t: 'table',
                        e: 'days-table',
                        c: [objRow]
                    }
                ]
            };

        for(var day = 1; day <= daysMonth[m]; day++) {
            title = '';
            date.setDate(day);
            dateTs = +date;
            weekday = date.getDay();
            holiday = par.getHoliday(day, m, y);
            mods = {};

            if(weekday === SUNDAY || weekday === SATURDAY) {
                mods.holiday = true;
            } else {
                mods.workday = true;
            }

            if(holiday === 0) {
                mods.nonholiday = true;
            } else if(holiday === 1) {
                mods.highday = true;
            }

            if(isSelected(day, m, y)) {
                mods.selected = true;
            }

            if(currentTs === dateTs) {
                mods.now = true;
                title = par.text('today');
            }

            if((minTs && dateTs < minTs) || (maxTs && dateTs > maxTs)) {
                mods.minmax = true;
            }

            var tt = par.title.get(par._ymdToISO(y, m, day));
            if(tt) {
                mods['has-title'] = true;
                mods['title-color'] = tt.color || 'default';
            }

            if(weekday === dayNames.first) {
                objRow = {
                    t: 'tr',
                    c: []
                };

                obj.c[1].c.push(objRow);
            }

            objRow.c.push({
                t: 'td',
                e: 'day',
                m: mods,
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
                e: 'year-selector',
                c: {
                    e: 'year-selector-i'
                }
            }];

        for(var i = startYear; i <= endYear; i++) {
            buf.push({
                e: 'year',
                'data-year': i,
                c: i
            });
         }

        return buf;
    },
    months: function() {
        var buf = [{
            e: 'month-selector',
            c: {
                e: 'month-selector-i'
            }
        }];

        this.parent.text('months').forEach(function(el, i) {
            buf.push({
                e: 'month',
                'data-month': i,
                c: el
            });
        });

        return buf;
    },
    main: function() {
        var par = this.parent,
            wd = par.text('firstWeekday') || SUNDAY,
            dayNames = par.text('dayNames') || [],
            bufDayNames = [];

        par.text('shortDayNames').forEach(function(el, i, data) {
            bufDayNames.push({
                e: 'short-daynames-cell',
                m: {
                    n: wd
                },
                title: dayNames[wd] || data[wd],
                c: data[wd]
            });

            wd++;
            if(wd > SATURDAY) {
                wd = SUNDAY;
            }
        }, this);

        return [
            {
                e: 'short-daynames',
                c: bufDayNames
            }, {
                e: 'container',
                c: [{
                        e: 'days',
                        c: {
                            e: 'days-container',
                            c: this.days()
                        }
                    },
                    {
                        e: 'months',
                        c: this.months()
                    },
                    {
                        e: 'years',
                        c: {
                            e: 'years-container',
                            c: this.years()
                        }
                    }
                ]
            }
        ];
    },
    destroy: function(){
    }
});
