const
    gulp = require('gulp'),
    clean = require('./clean'),
    minCss = require('./css/min'),
    minJs = require('./js/min');

gulp.task('default', gulp.series(clean, gulp.parallel(minCss, minJs)));

gulp.task('watch', function watch() {
    gulp.watch('src/css/**/*', minCss);
    gulp.watch('src/js/**/*', minJs);
    gulp.watch('src/json/**/*', minJs);
});
