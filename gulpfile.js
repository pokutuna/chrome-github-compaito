var gulp = require('gulp'),
    changed = require('gulp-changed'),
    tsc  = require('gulp-tsc');

gulp.task('typescript', function() {
    gulp.src('src/**/*.ts')
        .pipe(changed('src/js'), { extension: '.js' })
        .pipe(tsc({ emitError: false }))
        .pipe(gulp.dest('src/js'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', ['typescript']);
});
