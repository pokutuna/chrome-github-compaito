var gulp       = require('gulp'),
    editJson   = require('gulp-json-editor'),
    typescript = require('gulp-typescript'),
    sass       = require('gulp-sass'),
    jade       = require('gulp-jade'),
    glob       = require('glob'),
    path       = require('path'),
    exec       = require('child_process').exec,
    concat     = require('gulp-concat'),
    Promise    = require('es6-promise').Promise;

gulp.task('default', ['build', 'watch']);



var tsProject = typescript.createProject({ noExternalResolve: true, sortOutput: true });
var distributeFiles = glob.sync('src/*.ts').map(function(p) { return path.basename(p, '.ts'); });
distributeFiles.forEach(function(name) {
    var project = typescript.createProject({ noExternalResolve: true, sortOutput: true });
    gulp.task(name, function() {
        gulp.src('src/**/*.ts')
        .pipe(typescript(project, { referencedFrom: [name.concat('.ts')] }))
        .js
        .pipe(concat(name.concat('.js')))
        .pipe(gulp.dest('app/js'));
    });
});

gulp.task('typescript', distributeFiles);

// gulp.task('typescript', function(cb) {
//     distributeFiles.forEach(function(filepath) {
//         var basename = path.basename(filepath);
//         gulp.src('src/**/*.ts')
//             .pipe(typescript(tsProject, { referencedFrom: [basename]}))
//             .js
//             .pipe(concat(path.basename(basename, '.ts').concat('.js')))
//             .pipe(gulp.dest('app/js'));
//     });
//     // var promise = new Promise(function(resolve, reject) { resolve(); });
//     // distributeFiles.forEach(function(filepath) {
//     //     promise.then(function() {
//     //         console.log(filepath);
//     //         var basename = path.basename(filepath);
//     //         gulp.src('src/**/*.ts')
//     //             .pipe(typescript(tsProject, { referencedFrom: [basename]}))
//     //             .js
//     //             .pipe(concat(path.basename(basename, '.ts').concat('.js')))
//     //             .pipe(gulp.dest('app/js'));
//     //     });
//     // });
//     // promise.then(cb);
// });

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
