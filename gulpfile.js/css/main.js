const
    { src, dest } = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    paths = require('../paths');

function main() {
    return src(paths.css.main)
        .pipe(sass())
        .pipe(rename('calendula.css'))
        .pipe(dest(paths.dest));
}

module.exports = main;
