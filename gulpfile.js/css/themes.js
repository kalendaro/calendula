const
    { src, dest } = require('gulp'),
    sass = require('gulp-sass'),
    paths = require('../paths');

function themes() {
    return src(paths.css.themes)
        .pipe(sass())
        .pipe(dest(`${paths.dest}/themes/`));
}

module.exports = themes;
