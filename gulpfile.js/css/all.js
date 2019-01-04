const
    { src, dest } = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    paths = require('../paths');

function all() {
    return src(paths.css.all)
        .pipe(concat('calendula.all.scss'))
        .pipe(sass())
        .pipe(rename('calendula.all.css'))
        .pipe(dest(paths.dest));
}

module.exports = all;
