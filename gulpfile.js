var gulp = require('gulp'),
    path = require('path'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cleancss = require('gulp-cleancss'),
    uglify = require('gulp-uglify');

var paths = {
    mainJs: [
        'sources/js/start.js',
        'sources/js/vars.js',
        'sources/js/main.js',
        'sources/js/dom.js',
        'sources/js/offset.js',
        'sources/js/timeout.js',
        'sources/js/event.js',
        'sources/js/template.js',
        'sources/js/holiday.js',
        'sources/js/date.js',
        'sources/js/locale.js'
    ],
    mainCss: [
        'sources/css/calendula.css'
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

paths.devJs = paths.mainJs.concat('sources/js/locale/*.js', 'sources/js/holiday/*.js', 'sources/js/end.js');
paths.prodJsBase = paths.mainJs.concat('sources/js/end.js');
paths.prodJsAll = paths.mainJs.concat('sources/js/locale/calendula.locale.*.js', 'sources/js/locale/calendula.holiday.*.js', 'sources/js/end.js');

paths.devCss = paths.mainCss.concat('sources/css/calendula.theme.*.css');
paths.prodCssAll = paths.mainCss.concat('sources/css/calendula.theme.*.css');

var jsTasks = ['devJs', 'prodJsBase', 'prodJsAll', 'prodJsLocales', 'prodJsHolidays'],
    cssTasks = ['devCss', 'prodCssBase', 'prodCssAll', 'prodCssThemes'],
    allTasks = [].concat(cssTasks, jsTasks, 'watch');
    
gulp.task('devJs', function() {
    return gulp.src(paths.devJs)
        .pipe(concat('calendula.dev.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('prodJsBase', function() {
    return gulp.src(paths.prodJsBase)
        .pipe(concat('calendula.base.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('prodJsAll', function() {
    return gulp.src(paths.prodJsAll)
        .pipe(concat('calendula.all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('prodJsLocales', function() {
    return gulp.src(paths.prodJsLocales)
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('prodJsHolidays', function() {
    return gulp.src(paths.prodJsHolidays)
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('devCss', function() {
    return gulp.src(paths.devCss)
        .pipe(concat('calendula.dev.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('prodCssBase', function() {
    return gulp.src(paths.mainCss)
        .pipe(concat('calendula.base.css'))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest('./build'));
});

gulp.task('prodCssAll', function() {
    return gulp.src(paths.prodCssAll)
        .pipe(concat('calendula.all.css'))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest('./build'));
});

gulp.task('prodCssThemes', function() {
    return gulp.src(paths.prodCssThemes)
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
    gulp.watch('sources/js/**/*', jsTasks);
    gulp.watch('sources/css/**/*', cssTasks);
});

gulp.task('default', allTasks);
