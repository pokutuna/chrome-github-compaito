var gulp    = require('gulp'),
    changed = require('gulp-changed'),
    tsc     = require('gulp-tsc'),
    jade    = require('gulp-jade');

gulp.task('default', ['build', 'watch']);

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

// TODO fill-in version
gulp.task('manifest', function() {
    gulp.src('src/manifest.json')
        .pipe(gulp.dest('app/'));
});

gulp.task('build', ['manifest', 'typescript', 'css', 'jade']);

gulp.task('watch', function() {
    gulp.watch('src/manifest.json', ['manifest']);
    gulp.watch('src/**/*.ts', ['typescript']);
    gulp.watch('src/**/*.css', ['css']);
    gulp.watch('src/**/*.jade', ['jade']);
});
