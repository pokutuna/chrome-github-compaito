var gulp    = require('gulp'),
    changed = require('gulp-changed'),
    tsc     = require('gulp-tsc'),
    sass    = require('gulp-sass'),
    jade    = require('gulp-jade');

gulp.task('default', ['build', 'watch']);

gulp.task('typescript', function() {
    gulp.src('src/**/*.ts')
        .pipe(changed('app/js'), { extension: '.js' })
        .pipe(tsc({ emitError: false }))
        .pipe(gulp.dest('app/js'));
});

gulp.task('sass', function() {
    gulp.src('src/**/*.scss')
        .pipe(sass())
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

gulp.task('build', ['manifest', 'typescript', 'sass', 'jade']);

gulp.task('watch', function() {
    gulp.watch('src/manifest.json', ['manifest']);
    gulp.watch('src/**/*.ts', ['typescript']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.jade', ['jade']);
});
