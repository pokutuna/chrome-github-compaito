var gulp     = require('gulp'),
    changed  = require('gulp-changed'),
    editJson = require('gulp-json-editor'),
    tsc      = require('gulp-tsc'),
    sass     = require('gulp-sass'),
    jade     = require('gulp-jade'),
    exec     = require('child_process').exec,
    Promise  = require('es6-promise').Promise;

gulp.task('default', ['build', 'watch']);

gulp.task('typescript', function() {
    gulp.src('src/**/*.ts')
        .pipe(changed('app/js'), { extension: '.js' })
        .pipe(tsc({ emitError: false }))
        .pipe(gulp.dest('app/js'));
});

gulp.task('sass', function() {
    gulp.src('src/**/*.scss')
        .pipe(sass({ errLogToConsole: true }))
        .pipe(gulp.dest('app/css'));
});

gulp.task('jade', function() {
    gulp.src('src/**/*.jade')
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('app/html'));
});

gulp.task('manifest', function() {
    version().then(function(version) {
        gulp.src('src/manifest.json')
        .pipe(editJson({ version : version }))
        .pipe(gulp.dest('app/'));
    });
});
function version() {
    var promise = new Promise(function(resolve, reject) {
        exec('git describe --tags --always --dirty', function(err, stdout, stderr) {
            return err ? reject(err) : resolve(stdout);
        });
    });
    return promise.then(function(desc) {
        var version = desc.replace(/\n$/, '')
            .replace(/-(\d+)/, '.$1')
            .replace(/-g[0-9a-f]+/, '')
            .replace(/-dirty/, '');
        return version;
    });
}

gulp.task('build', ['manifest', 'typescript', 'sass', 'jade']);

gulp.task('watch', function() {
    gulp.watch('src/manifest.json', ['manifest']);
    gulp.watch('src/**/*.ts', ['typescript']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.jade', ['jade']);
});
