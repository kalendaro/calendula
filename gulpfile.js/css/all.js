const
    { series, src, dest } = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    paths = require('../paths'),
    main = require('./main');

function all() {
    return src(paths.css.all)
        .pipe(concat('calendula.all.scss'))
        .pipe(sass())
        .pipe(
            postcss([
                autoprefixer()
            ])
        )
        .pipe(rename('calendula.all.css'))
        .pipe(dest(paths.dest));
}

module.exports = series(main, all);
