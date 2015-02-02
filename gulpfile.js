var gulp    = require('gulp'),
    changed = require('gulp-changed'),
    tsc     = require('gulp-tsc'),
    jade    = require('gulp-jade');

gulp.task('typescript', function() {
    gulp.src('src/**/*.ts')
        .pipe(changed('app/js'), { extension: '.js' })
        .pipe(tsc({ emitError: false }))
        .pipe(gulp.dest('app/js'));
});

// TODO less
gulp.task('css', function() {
    gulp.src('src/**/*.css')
        .pipe(gulp.dest('app/css'));
});

gulp.task('jade', function() {
    gulp.src('src/**/*.jade')
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('app/html'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', ['typescript']);
});
