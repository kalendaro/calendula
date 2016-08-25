const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-cleancss');
const concat = require('gulp-concat');
const less = require('gulp-less');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');

const apBrowsers = {
    browsers: ['ie >= 9', 'Firefox >= 24', 'Chrome >= 26', 'iOS >= 5', 'Safari >= 6', 'Android > 2.3']
};

const destDir = './dist';

const paths = {
    mainCss: [
        'src/less/calendula.less',
        'src/less/calendula__tooltip.less'
    ],
    mainJs: [
        'src/js/start.js',
        'src/js/lib/*.js',
        'src/js/main.js',
        'src/js/version.js',
        'src/js/ext.js',
        'src/js/ext/*.js',

        'src/js/end.js'
    ],
    prodJsLocales: [
        'src/js/locale/*.js'
    ],
    prodJsHolidays: [
        'src/js/holiday/*.js'
    ],
    prodCssThemes: [
        'src/less/calendula.theme.*.less'
    ]
};

paths.devJs = paths.mainJs.concat('src/js/locale/*.js', 'src/js/holiday/*.js');
paths.prodJsBase = paths.mainJs;
paths.prodJsAll = paths.mainJs.concat('src/js/locale/calendula.locale.*.js', 'src/js/holiday/calendula.holiday.*.js');

paths.devCss = paths.mainCss.concat('src/less/calendula.theme.*.less');
paths.prodCssAll = paths.mainCss.concat('src/less/calendula.theme.*.less');

const jsTasks = ['devJs', 'prodJsBase', 'prodJsAll', 'prodJsLocales', 'prodJsHolidays'];
const cssTasks = ['devCss', 'prodCssBase', 'prodCssAll', 'prodCssThemes'];
const allTasks = [].concat(cssTasks, jsTasks);

gulp.task('version', function() {
    const file = './src/js/version.js';
    gulp.src(file, {base: './'})
        .pipe(replace(/'[\d.]+'/, '\'' + require('./package.json').version + '\''))
        .pipe(gulp.dest(''));
});

gulp.task('devJs', ['version'], function() {
    return gulp.src(paths.devJs)
        .pipe(concat('calendula.dev.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsBase', ['version'], function() {
    return gulp.src(paths.prodJsBase)
        .pipe(concat('calendula.base.js'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsAll', ['version'], function() {
    return gulp.src(paths.prodJsAll)
        .pipe(concat('calendula.all.js'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsLocales', function() {
    return gulp.src(paths.prodJsLocales)
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsHolidays', function() {
    return gulp.src(paths.prodJsHolidays)
        .pipe(uglify())
        .pipe(gulp.dest(destDir));
});

gulp.task('devCss', function() {
    return gulp.src(paths.devCss)
        .pipe(concat('calendula.dev.css'))
        .pipe(less())
        .pipe(autoprefixer(apBrowsers))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssBase', function() {
    return gulp.src(paths.mainCss)
        .pipe(concat('calendula.base.css'))
        .pipe(less())
        .pipe(autoprefixer(apBrowsers))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssAll', function() {
    return gulp.src(paths.prodCssAll)
        .pipe(concat('calendula.all.css'))
        .pipe(less())
        .pipe(autoprefixer(apBrowsers))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssThemes', function() {
    return gulp.src(paths.prodCssThemes)
        .pipe(less())
        .pipe(autoprefixer(apBrowsers))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*', jsTasks);
    gulp.watch('src/less/**/*', cssTasks);
});

gulp.task('default', allTasks);
