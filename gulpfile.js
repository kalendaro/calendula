var gulp = require('gulp');
var path = require('path');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cleancss = require('gulp-cleancss');
var uglify = require('gulp-uglify');

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
        .pipe(concat('calendula.dev.js'))
        .pipe(gulp.dest('./source'));
});

gulp.task('uglify', function() {
    return gulp.src(paths.js)
        .pipe(concat('calendula.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(concat('calendula.dev.css'))
        .pipe(gulp.dest('./source'));
});

gulp.task('cleancss', function() {
    return gulp.src(paths.css)
        .pipe(concat('calendula.css'))
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', [
    'js',
    'uglify',
    'css',
    'cleancss'
]);

gulp.task('watch', function() {
    gulp.run('js');
    gulp.run('css');
    
    gulp.watch('source/js/**/*', function() {
        gulp.run('js');
    });
    
    gulp.watch('source/css/**/*', function() {
        gulp.run('css');
    });
});
