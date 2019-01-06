const
    { series, src, dest } = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    paths = require('../paths'),
    main = require('./main');

function all() {
    return src(paths.css.all)
        .pipe(sass())
        .pipe(rename('calendula.all.css'))
        .pipe(dest(paths.dest));
}

module.exports = series(main, all);
