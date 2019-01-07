const
    { dest, series, src } = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    all = require('./all'),
    paths = require('../paths');

function min() {
    return src(`${paths.dest}/*.js`)
        .pipe(rename((path) => {
            path.basename += '.min';
        }))
        .pipe(uglify({output: {comments: /^!/}}))
        .pipe(dest(paths.dest));
}

module.exports = series(all, min);
