'use strict';

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const uglifyOptions = {output: {comments: /^!/}};

const version = require('./package.json').version;
function updateVersion() { return $.replace(/\{\{version\}\}/, version); }

const apBrowsers = {
    browsers: ['ie > 9', 'Firefox >= 46', 'Chrome >= 46', 'iOS >= 7', 'Safari >= 7', 'Android > 4.4']
};

const destDir = './dist';

const paths = {
    mainCss: [
        'src/styl/calendula.styl'
    ],
    mainJs: [
        'src/js/main.js'
    ],
    prodJsLocales: [
        'src/js/locale/*.js'
    ],
    prodJsHolidays: [
        'src/js/holiday/*.js'
    ],
    prodCssThemes: [
        'src/styl/calendula.theme.*.styl'
    ]
};

const includeOptions = {
    extensions: 'js',
    includePaths: [
      __dirname + '/src/js'
    ]
};

paths.devJs = paths.mainJs.concat('src/js/locale/*.js', 'src/js/holiday/*.js');
paths.prodJsBase = paths.mainJs;
paths.prodJsAll = paths.mainJs.concat('src/js/locale/calendula.locale.*.js', 'src/js/holiday/calendula.holiday.*.js');

paths.devCss = paths.mainCss.concat('src/styl/calendula.theme.*.styl');
paths.prodCssAll = paths.mainCss.concat('src/styl/calendula.theme.*.styl');

const jsTasks = ['devJs', 'prodJsBase', 'prodJsAll', 'prodJsLocales', 'prodJsHolidays'];
const cssTasks = ['devCss', 'prodCssBase', 'prodCssAll', 'prodCssThemes'];
const allTasks = [].concat(cssTasks, jsTasks);

gulp.task('devJs', function() {
    return gulp.src(paths.devJs)
        .pipe($.concat('calendula.dev.js'))
        .pipe($.include(includeOptions))
        .pipe(updateVersion())
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsBase', function() {
    return gulp.src(paths.prodJsBase)
        .pipe($.concat('calendula.base.js'))
        .pipe($.include(includeOptions))
        .pipe(updateVersion())
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsAll', function() {
    return gulp.src(paths.prodJsAll)
        .pipe($.concat('calendula.all.js'))
        .pipe($.include(includeOptions))
        .pipe(updateVersion())
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsLocales', function() {
    return gulp.src(paths.prodJsLocales)
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsHolidays', function() {
    return gulp.src(paths.prodJsHolidays)
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('devCss', function() {
    return gulp.src(paths.devCss)
        .pipe($.concat('calendula.dev.styl'))
        .pipe($.stylus())
        .pipe($.replace('calendula.dev.css'))
        .pipe($.autoprefixer(apBrowsers))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssBase', function() {
    return gulp.src(paths.mainCss)
        .pipe($.concat('calendula.base.styl'))
        .pipe($.stylus())
        .pipe($.replace('calendula.base.css'))
        .pipe($.autoprefixer(apBrowsers))
        .pipe($.cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssAll', function() {
    return gulp.src(paths.prodCssAll)
        .pipe($.concat('calendula.all.styl'))
        .pipe($.stylus())
        .pipe($.replace('calendula.all.css'))
        .pipe($.autoprefixer(apBrowsers))
        .pipe($.cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssThemes', function() {
    return gulp.src(paths.prodCssThemes)
        .pipe($.stylus())
        .pipe($.autoprefixer(apBrowsers))
        .pipe($.cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*', jsTasks);
    gulp.watch('src/styl/**/*', cssTasks);
});

gulp.task('default', allTasks);
