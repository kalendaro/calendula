const
    { src, dest } = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    paths = require('../paths');

function main() {
    return src(paths.css.main)
        .pipe(concat('calendula.scss'))
        .pipe(sass())
        .pipe(rename('calendula.css'))
        .pipe(dest(paths.dest));
}

module.exports = main;
