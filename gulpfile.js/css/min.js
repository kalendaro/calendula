const
    { src, dest, series } = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    rename = require('gulp-rename'),
    all = require('./all'),
    paths = require('../paths'),
    themes = require('./themes');

function min() {
    return src(`${paths.dest}/*.css`)
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(dest(paths.dest));
}

module.exports = series(all, themes, min);
