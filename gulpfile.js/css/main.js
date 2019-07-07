const
    { src, dest } = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    paths = require('../paths');

function main() {
    return src(paths.css.main)
        .pipe(sass())
        .pipe(
            postcss([
                autoprefixer()
            ])
        )
        .pipe(rename('calendula.css'))
        .pipe(dest(paths.dest));
}

module.exports = main;
