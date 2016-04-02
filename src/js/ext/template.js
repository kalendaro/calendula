/*
 * Extension: Template
*/
Cln.addExt('template', null, {
    /**
     * Get a template.
     * @param {string} name
     * @return {*}
    */
    get: function(name) {
        return jshtml(this[name]());
    },
    SATURDAY: 6,
    SUNDAY: 0,
    /**
     * Template: days
     * @return {Array}
    */
    days: function() {
        var buf = [];

        for(var m = MIN_MONTH; m <= MAX_MONTH; m++) {
            buf.push(this.month(m, this.parent._currentDate.year));
        }

        return buf;
    },
    /**
     * Template: dayNames
     * @return {Object}
    */
    dayNames: function() {
        var first = this.parent.text('firstWeekday') || 0,
            w = {
                first: first,
                last: !first ? this.SATURDAY : first - 1
            },
            n = first;

        for(var i = 0; i < 7; i++) {
            w[n] = i;

            n++;
            if(n > this.SATURDAY) {
                n = this.SUNDAY;
            }
        }

        return w;
    },
    /**
     * Template: month
     * @param {number} m - Month.
     * @param {number} y - Year.
     * @return {Array}
    */
    month: function(m, y) {
        var current = new Date();
        current.setHours(12, 0, 0, 0);

        var date = new Date(y, m, 1, 12, 0, 0, 0),
            dateTs = date.getTime(),
            par = this.parent,
            weekday = date.getDay(),
            dayNames = this.dayNames(),
            dayIndex = dayNames[weekday],
            minSetting = par.setting('min'),
            maxSetting = par.setting('max'),
            minTs = this._getTs(minSetting),
            maxTs = this._getTs(maxSetting),
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
                        c: dayIndex < 3 ? '' : this._getTitleMonth(minSetting, maxSetting, m, y)
                    } : ''
                ]
            },
            objRow = objFirstRow,
            obj = {
                e: 'days-month',
                c: [
                    dayIndex < 3 ? this._getTitleMonth(minSetting, maxSetting, m, y) : '',
                    {
                        t: 'table',
                        e: 'days-table',
                        c: [objRow]
                    }
                ]
            };

        for(var day = 1; date.getMonth() === m; date.setDate(++day)) {
            title = '';
            dateTs = +date;
            weekday = date.getDay();
            holiday = par.getHoliday(day, m, y);
            mods = {};

            if(weekday === this.SUNDAY || weekday === this.SATURDAY) {
                mods.holiday = true;
            } else {
                mods.workday = true;
            }

            if(holiday === 0) {
                mods.nonholiday = true;
            } else if(holiday === 1) {
                mods.highday = true;
            }

            if(this._isSelected(par._val, day, m, y)) {
                mods.selected = true;
            }

            if(currentTs === dateTs) {
                mods.now = true;
                title = par.text('today');
            }

            if((minTs && dateTs < minTs) || (maxTs && dateTs > maxTs)) {
                mods.minmax = true;
            }

            var tt = par.title.get(ymdToISO(y, m, day));
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
    /**
     * Template: years
     * @return {Array}
    */
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
    /**
     * Template: months
     * @return {Array}
    */
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
    /**
     * Template: main
     * @return {Array}
    */
    main: function() {
        var par = this.parent,
            wd = par.text('firstWeekday') || this.SUNDAY,
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
            if(wd > this.SATURDAY) {
                wd = this.SUNDAY;
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
    /**
     * Destructor.
    */
    destroy: function() {},

    _isSelected: function(val, d, m, y) {
        return d === val.day && m === val.month && y === val.year;
    },

    _getTitleMonth: function(minSetting, maxSetting, m, y) {
        function getValue(setting) {
            return parseNum('' + setting.year + leadZero(setting.month));
        }

        var min = getValue(minSetting),
            max = getValue(maxSetting),
            mods = {},
            cur = parseNum('' + y + leadZero(m));

        if((minSetting && cur < min) || (maxSetting && cur > max)) {
            mods.minmax = true;
        }

        return {
            e: 'days-title-month',
            m: mods,
            c: this.parent.text('months')[m]
        };
    },

    _getTs: function(d) {
        if(!d.year) {
            return null;
        }

        return new Date(d.year, d.month, d.day, 12, 0, 0, 0).getTime();
    }
});
