var gulp = require('gulp');
var path = require('path');

var concat = require('gulp-concat');
var rename = require('gulp-rename');

var paths = {
    js: [
        'source/js/start.js',
        'source/js/vars.js',
        'source/js/main.js',
        'source/js/event.js',
        'source/js/template.js',
        'source/js/date.js',
        'source/js/utils.js',
        'source/js/locale.js',
        'source/js/locale/*.js',
        'source/js/end.js'
    ],
    css: [
        'source/css/main.css'
    ]
};

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(concat('calendula.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(concat('calendula.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', [
    'js',
    'css'
]);
