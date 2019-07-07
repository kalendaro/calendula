const
    { src, dest } = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    paths = require('../paths');

function themes() {
    return src(paths.css.themes)
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(dest(`${paths.dest}/themes/`));
}

module.exports = themes;
