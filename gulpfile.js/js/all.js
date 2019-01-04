const
    { dest, series, src } = require('gulp'),
    concat = require('gulp-concat'),
    paths = require('../paths'),
    holidays = require('./holidays'),
    locales = require('./locales'),
    main = require('./main');

function all() {
    return src([].concat(`${paths.dest}/calendula.js`, paths.js.all))
        .pipe(concat('calendula.all.js'))
        .pipe(dest(paths.dest));
}

module.exports = series(main, holidays, locales, all);
