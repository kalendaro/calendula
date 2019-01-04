const
    { src, dest, series } = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-cleancss'),
    rename = require('gulp-rename'),
    all = require('./all'),
    paths = require('../paths'),
    supportedBrowsers = require('./supportedBrowsers'),
    themes = require('./themes');

function min() {
    return src(`${paths.dest}/*.css`)
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(autoprefixer(supportedBrowsers))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(dest(paths.dest));
}

module.exports = series(all, themes, min);