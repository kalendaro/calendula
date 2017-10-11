'use strict';

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglifyOptions = {output: {comments: /^!/}};

const version = require('./package.json').version;
function updateVersion() { return $.replace(/\{\{version\}\}/, version); }

const apBrowsers = {
    browsers: ['ie > 9', 'Firefox >= 46', 'Chrome >= 46', 'iOS >= 7', 'Safari >= 7', 'Android > 4.4']
};

const destDir = './dist';

const paths = {
    css: ['src/styl/calendula.styl'],
    cssAll: ['src/styl/calendula.styl', 'src/styl/calendula.theme.*.styl'],
    cssThemes: ['src/styl/calendula.theme.*.styl'],
    js: 'src/js/main.js',
    jsAll: ['src/js/locale/*.js', 'src/js/holiday/*.js'],
    jsLocales: ['src/js/locale/*.js'],
    jsHolidays: ['src/js/holiday/*.js']
};

const jsTasks = ['js', 'jsAll', 'jsLocales', 'jsHolidays'];
const cssTasks = ['css', 'cssAll', 'cssThemes'];
const allTasks = [].concat(cssTasks, jsTasks);

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe($.rollup({
            allowRealFiles: true,
            input: paths.js,
            format: 'umd',
            name: 'Calendula',
            plugins: [
                nodeResolve({
                  jsnext: true,
                  main: true
                }),
                commonjs({
                  include: 'node_modules/**',  // Default: undefined
                  sourceMap: false,  // Default: true
                  ignore: [ 'conditional-runtime-dependency' ]
                }),
                babel()
            ]
        }))
        .pipe(updateVersion())
        .pipe($.rename('calendula.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('jsMin', function() {
    return gulp.src('./dist/calendula.js')
        .pipe($.concat('calendula.min.js'))
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('jsAll', ['js'], function() {
    return gulp.src([].concat('./dist/calendula.js', paths.jsAll))
        .pipe($.concat('calendula.all.js'))
        .pipe($.babel())
        .pipe(gulp.dest(destDir));
});

gulp.task('jsAllMin', function() {
    return gulp.src([].concat('./dist/calendula.js', paths.jsAll))
        .pipe($.concat('calendula.all.min.js'))
        .pipe($.babel())
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('jsLocales', function() {
    return gulp.src(paths.jsLocales)
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('jsHolidays', function() {
    return gulp.src(paths.jsHolidays)
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe($.concat('calendula.styl'))
        .pipe($.stylus())
        .pipe($.replace('calendula.css'))
        .pipe($.autoprefixer(apBrowsers))
        .pipe($.cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('cssAll', function() {
    return gulp.src(paths.cssAll)
        .pipe($.concat('calendula.all.styl'))
        .pipe($.stylus())
        .pipe($.replace('calendula.all.css'))
        .pipe($.autoprefixer(apBrowsers))
        .pipe($.cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('cssThemes', function() {
    return gulp.src(paths.cssThemes)
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
