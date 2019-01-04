/**
 * Extension: Template
 */
import { leadZero, ymdToISO } from '../lib/date';
import { MIN_MONTH, MAX_MONTH, SATURDAY, SUNDAY } from '../consts';
import jstohtml from '../jstohtml';

export default class Template {
    /**
     * Get a template.
     *
     * @param {string} name
     * @returns {*}
     */
    get(name) {
        return jstohtml(this[name]());
    }

    /**
     * Template: days
     *
     * @returns {Array}
     */
    days() {
        const buf = [];

        for (let m = MIN_MONTH; m <= MAX_MONTH; m++) {
            buf.push(this.month(m, this.parent._currentDate.year));
        }

        return buf;
    }

    /**
     * Template: dayNames
     *
     * @returns {Object}
     */
    dayNames() {
        const
            first = this.parent.text('firstWeekday') || 0,
            week = {
                first: first,
                last: !first ? SATURDAY : first - 1
            };

        let day = first;

        for (let i = 0; i < 7; i++) {
            week[day] = i;

            day++;
            if (day > SATURDAY) {
                day = SUNDAY;
            }
        }

        return week;
    }

    /**
     * Template: month
     *
     * @param {number} m - Month.
     * @param {number} y - Year.
     * @returns {Array}
     */
    month(m, y) {
        const
            date = new Date(y, m, 1, 12, 0, 0, 0),
            parent = this.parent,
            data = {
                weekday: date.getDay(),
                min: parent.setting('min'),
                max: parent.setting('max'),
                dayNames: this.dayNames()
            },
            minTs = this._getTs(data.min),
            maxTs = this._getTs(data.max),
            todayTs = this._todayAt12();

        let row = this._monthFirstRow(data, m, y);
        const result = this._daysMonth(data, m, y, row);

        for (let day = 1; date.getMonth() === m; date.setDate(++day)) {
            let title = '';

            const dateTs = +date,
                mods = {},
                weekday = date.getDay(),
                holiday = parent.getHoliday(day, m, y);

            if (weekday === SUNDAY || weekday === SATURDAY) {
                mods.holiday = true;
            } else {
                mods.workday = true;
            }

            if (holiday === 0) {
                mods.nonholiday = true;
            } else if (holiday === 1) {
                mods.highday = true;
            }

            if (this._isSelected(parent._val, day, m, y)) {
                mods.selected = true;
            }

            if (todayTs === dateTs) {
                mods.now = true;
                title = parent.text('today');
            }

            if ((minTs && dateTs < minTs) || (maxTs && dateTs > maxTs)) {
                mods.minmax = true;
            }

            const tt = parent.title.get(ymdToISO(y, m, day));
            if (tt) {
                mods['has-title'] = true;
                mods['title-color'] = tt.color || 'default';
            }

            if (weekday === data.dayNames.first) {
                row = {
                    t: 'tr',
                    c: []
                };

                result.c[1].c.push(row);
            }

            row.c.push({
                t: 'td',
                e: 'day',
                m: mods,
                title,
                'data-month': m,
                'data-day': day,
                c: day
            });
        }

        return result;
    }

    _todayAt12() {
        const current = new Date();
        current.setHours(12, 0, 0, 0);
        return current.getTime();
    }

    _monthFirstRow(data, m, y) {
        const dayIndex = data.dayNames[data.weekday];

        return {
            t: 'tr',
            c: [
                data.weekday !== data.dayNames.first ? {
                    t: 'td',
                    colspan: dayIndex,
                    e: 'empty',
                    c: dayIndex < 3 ? '' : this._getTitleMonth(data.min, data.max, m, y)
                } : ''
            ]
        };
    }

    _daysMonth(data, m, y, content) {
        const dayIndex = data.dayNames[data.weekday];

        return {
            b: this.parent._name,
            e: 'days-month',
            c: [
                dayIndex < 3 ? this._getTitleMonth(data.min, data.max, m, y) : '',
                {
                    t: 'table',
                    e: 'days-table',
                    c: [ content ]
                }
            ]
        };
    }

    /**
     * Template: years
     *
     * @returns {Array}
     */
    years() {
        const
            data = this.parent._data,
            startYear = data._startYear,
            endYear = data._endYear,
            buf = [
                {
                    b: this.parent._name,
                    e: 'year-selector',
                    c: { e: 'year-selector-i' }
                }
            ];

        for (let i = startYear; i <= endYear; i++) {
            buf.push({
                b: this.parent._name,
                e: 'year',
                'data-year': i,
                c: i
            });
        }

        return buf;
    }

    /**
     * Template: months
     *
     * @returns {Array}
     */
    months() {
        const buf = [
            {
                b: this.parent._name,
                e: 'month-selector',
                c: { e: 'month-selector-i' }
            }
        ];

        this.parent.text('months').forEach((el, i) => {
            buf.push({
                b: this.parent._name,
                e: 'month',
                'data-month': i,
                c: el
            });
        });

        return buf;
    }

    /**
     * Template: main
     *
     * @returns {Array}
     */
    main() {
        const
            parent = this.parent,
            dayNames = parent.text('dayNames') || [],
            bufDayNames = [];

        let weekday = parent.text('firstWeekday') || SUNDAY;

        parent.text('shortDayNames').forEach((el, i, data) => {
            bufDayNames.push({
                e: 'short-daynames-cell',
                m: { n: weekday },
                title: dayNames[weekday] || data[weekday],
                c: data[weekday]
            });

            weekday++;
            if (weekday > SATURDAY) {
                weekday = SUNDAY;
            }
        }, this);

        return [
            {
                b: this.parent._name,
                e: 'short-daynames',
                c: bufDayNames
            }, {
                b: this.parent._name,
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
                }]
            }
        ];
    }

    _isSelected(val, d, m, y) {
        return d === val.day && m === val.month && y === val.year;
    }

    _getTitleMonth(min, max, m, y) {
        function getValue(setting) {
            return parseInt('' + setting.year + leadZero(setting.month), 10);
        }

        const
            minValue = getValue(min),
            maxValue = getValue(max),
            mods = {},
            cur = parseInt('' + y + leadZero(m), 10);

        if ((minValue && cur < minValue) || (maxValue && cur > maxValue)) {
            mods.minmax = true;
        }

        return {
            e: 'days-title-month',
            m: mods,
            c: this.parent.text('months')[m]
        };
    }

    _getTs(d) {
        return d.year ? new Date(d.year, d.month, d.day, 12, 0, 0, 0).getTime() : null;
    }
}
