var gulp       = require('gulp'),
    editJson   = require('gulp-json-editor'),
    typescript = require('gulp-typescript'),
    less       = require('gulp-less'),
    jade       = require('gulp-jade'),
    webpack    = require('gulp-webpack'),
    zip        = require('gulp-zip'),
    named      = require('vinyl-named'),
    exec       = require('child_process').exec,
    Promise    = require('es6-promise').Promise;

gulp.task('default', ['build', 'watch']);

var tsProject = typescript.createProject({ module: 'commonjs', sortOutput: true });
gulp.task('typescript', function() {
    return gulp.src('src/**/*.ts')
        .pipe(typescript(tsProject))
        .js.pipe(gulp.dest('src/build'));
});

gulp.task('webpack', ['typescript'], function() {
    return gulp.src('src/build/*.js')
        .pipe(named())
        .pipe(webpack())
        .pipe(gulp.dest('app/js'));
});

gulp.task('less', function() {
    return gulp.src('src/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'));
});

gulp.task('jade', function() {
    return gulp.src('src/**/*.jade')
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('app/html'));
});

gulp.task('img', function() {
    return gulp.src('src/img/sized/*.png')
        .pipe(gulp.dest('app/img'));
});

gulp.task('manifest', function() {
    return version().then(function(version) {
        return gulp.src('src/manifest.json')
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

gulp.task('build', ['manifest', 'less', 'jade', 'img', 'webpack']);

gulp.task('zip', ['build'], function() {
    return version().then(function(version) {
        return gulp.src('app/**/*')
            .pipe(zip('compaito-' + version + '.zip'))
            .pipe(gulp.dest('releases'));
    });
});

gulp.task('watch', function() {
    gulp.watch('src/manifest.json', ['manifest']);
    gulp.watch('src/**/*.ts', ['webpack']);
    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/**/*.jade', ['jade']);
});
