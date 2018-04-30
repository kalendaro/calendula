'use strict';

const
    gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')(),
    helpers = require('./gulp/helpers'),
    babel = require('rollup-plugin-babel'),
    commonjs = require('rollup-plugin-commonjs'),
    nodeResolve = require('rollup-plugin-node-resolve');

const
    uglifyOptions = {output: {comments: /^!/}},
    version = require('./package.json').version,
    updateVersion = () => { return $.replace(/\{\{version\}\}/, version); },
    apBrowsers = { browsers: ['ie > 9', 'Firefox >= 46', 'Chrome >= 46', 'iOS >= 7', 'Safari >= 7', 'Android > 4.4'] },
    destDir = './dist',
    paths = {
        css: [ 'src/styl/calendula.styl' ],
        cssAll: ['src/styl/calendula.styl', 'src/styl/calendula.theme.*.styl'],
        cssThemes: [ 'src/styl/calendula.theme.*.styl' ],
        js: 'src/js/main.js',
        jsAll: [`${destDir}/calendula.locale.*.js`, `${destDir}/calendula.holiday.*.js`],
        jsLocales: [ 'src/js/locale/*.js' ]
    };

const
    jsTasks = ['js', 'jsAll', 'jsMin', 'jsLocales', 'jsHolidays'],
    cssTasks = ['css', 'cssAll', 'cssMin', 'cssThemes'],
    allTasks = [].concat(cssTasks, jsTasks);

gulp.task('clean', function() {
    return del([
        `${destDir}/*`
    ]);
});

gulp.task('js', [ 'clean' ], function() {
    return gulp.src(paths.js)
        .pipe($.rollup({
            allowRealFiles: true,
            input: paths.js,
            output: {
                format: 'umd',
                name: 'Calendula'
            },
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


gulp.task('jsLocales', [ 'clean' ], function() { helpers.generateLocales(destDir); });
gulp.task('jsHolidays', [ 'clean' ], function() { helpers.generateHolidays(destDir); });

gulp.task('jsAll', ['js', 'jsHolidays', 'jsLocales'], function() {
    return gulp.src([].concat('./dist/calendula.js', paths.jsAll))
        .pipe($.concat('calendula.all.js'))
        .pipe($.babel())
        .pipe(gulp.dest(destDir));
});

gulp.task('jsMin', [ 'jsAll' ], function() {
    return gulp.src(`${destDir}/*.js`)
        .pipe($.rename(function(path) {
            path.basename += '.min';
        }))
        .pipe($.uglify(uglifyOptions))
        .pipe(gulp.dest(destDir));
});

gulp.task('css', [ 'clean' ], function() {
    return gulp.src(paths.css)
        .pipe($.concat('calendula.styl'))
        .pipe($.stylus())
        .pipe($.rename('calendula.css'))
        .pipe(gulp.dest(destDir));
});

gulp.task('cssAll', [ 'cssThemes' ], function() {
    return gulp.src(paths.cssAll)
        .pipe($.concat('calendula.all.styl'))
        .pipe($.stylus())
        .pipe($.rename('calendula.all.css'))
        .pipe(gulp.dest(destDir));
});

gulp.task('cssMin', [ 'cssAll' ], function() {
    return gulp.src(`${destDir}/*.css`)
        .pipe($.rename(function(path) {
            path.basename += '.min';
        }))
        .pipe($.autoprefixer(apBrowsers))
        .pipe($.cleancss({keepBreaks: false}))
        .pipe(gulp.dest(destDir));
});

gulp.task('cssThemes', [ 'clean' ], function() {
    return gulp.src(paths.cssThemes)
        .pipe($.stylus())
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*', jsTasks);
    gulp.watch('src/styl/**/*', cssTasks);
});

gulp.task('default', allTasks);
