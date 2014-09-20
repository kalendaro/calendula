var gulp = require('gulp'),
    path = require('path'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cleancss = require('gulp-cleancss'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    apBrowsers = {
        browsers: ['ie >= 9', 'Firefox >= 24', 'Chrome >= 26', 'iOS >= 5', 'Safari >= 6', 'Android > 2.3']
    },
    destDir = './build';
    
var paths = {
    mainJs: [
        'sources/js/start.js',
        'sources/js/vars.js',
        'sources/js/main.js',
        'sources/js/dom.js',
        'sources/js/em.js',
        'sources/js/object.js',
        'sources/js/offset.js',
        'sources/js/number.js',
        'sources/js/jshtml.js',
        'sources/js/timeout.js',
        'sources/js/event.js',
        'sources/js/dom_event.js',
        'sources/js/template.js',
        'sources/js/holiday.js',
        'sources/js/date.js',
        'sources/js/locale.js',
        'sources/js/title.js',
        'sources/js/tooltip.js',
        'sources/js/plugin.js',
        'sources/js/end.js'
    ],
    mainCss: [
        'sources/css/calendula.css',
        'sources/css/calendula__tooltip.css'
    ],
    prodJsLocales: [
        'sources/js/locale/*.js'
    ],
    prodJsHolidays: [
        'sources/js/holiday/*.js'
    ],
    prodCssThemes: [
        'sources/css/calendula.theme.*.css'
    ]
};

paths.devJs = paths.mainJs.concat('sources/js/locale/*.js', 'sources/js/holiday/*.js');
paths.prodJsBase = paths.mainJs;
paths.prodJsAll = paths.mainJs.concat('sources/js/locale/calendula.locale.*.js', 'sources/js/locale/calendula.holiday.*.js');

paths.devCss = paths.mainCss.concat('sources/css/calendula.theme.*.css');
paths.prodCssAll = paths.mainCss.concat('sources/css/calendula.theme.*.css');

var jsTasks = ['devJs', 'prodJsBase', 'prodJsAll', 'prodJsLocales', 'prodJsHolidays'],
    cssTasks = ['devCss', 'prodCssBase', 'prodCssAll', 'prodCssThemes'],
    allTasks = [].concat(cssTasks, jsTasks, 'watch');
    
gulp.task('devJs', function() {
    return gulp.src(paths.devJs)
        .pipe(concat('calendula.dev.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsBase', function() {
    return gulp.src(paths.prodJsBase)
        .pipe(concat('calendula.base.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsAll', function() {
    return gulp.src(paths.prodJsAll)
        .pipe(concat('calendula.all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destDir));
});

gulp.task('prodJsLocales', function() {
    return gulp.src(paths.prodJsLocales)
        .pipe(uglify())
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
        .pipe(autoprefixer(apBrowsers))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssBase', function() {
    return gulp.src(paths.mainCss)
        .pipe(concat('calendula.base.css'))
        .pipe(autoprefixer(apBrowsers))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssAll', function() {
    return gulp.src(paths.prodCssAll)
        .pipe(concat('calendula.all.css'))
        .pipe(autoprefixer(apBrowsers))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('prodCssThemes', function() {
    return gulp.src(paths.prodCssThemes)
        .pipe(autoprefixer(apBrowsers))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', function() {
    gulp.watch('sources/js/**/*', jsTasks);
    gulp.watch('sources/css/**/*', cssTasks);
});

gulp.task('default', allTasks);
