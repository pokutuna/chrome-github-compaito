var gulp       = require('gulp'),
    browserify = require('browserify'),
    watchify   = require('watchify'),
    tsify      = require('tsify'),
    editJson   = require('gulp-json-editor'),
    less       = require('gulp-less'),
    jade       = require('gulp-jade'),
    zip        = require('gulp-zip'),
    logger     = require('gulp-logger'),
    gutil      = require('gulp-util'),
    source     = require('vinyl-source-stream'),
    path       = require('path'),
    exec       = require('child_process').exec,
    Promise    = require('es6-promise').Promise;

function buildScript(file, watch) {
    let bundler = browserify({
        entries: file,
        debug: true,
        plugin: watch ? [watchify, tsify] : [tsify],
        cache: {}, packageCache: {}
    });

    function rebundle() {
        return bundler
            .bundle()
            .on('error', function(error) {
                gutil.log(error.toString());
                this.emit('end');
            })
            .pipe(source(path.basename(file).replace(/\.ts$/, '.js')))
            .pipe(gulp.dest('app/js'))
            .pipe(logger({ before: 'wrote: ' }));
    }

    bundler.on('update', function() {
        console.log(arguments);
        console.log(bundler._options.cache);
        // TODO
        // 依存含まれているやつなら更新したい
        // tsify を transform してみる
        rebundle();
    });

    return rebundle();
}

var targets = [
    {
        name:  'content',
        entry: './src/content.ts'
    },
    {
        name:  'background',
        entry: './src/background.ts'
    },
    {
        name:  'options',
        entry: './src/options.ts'
    }
];
for (let t of targets) {
    gulp.task(`${t.name}-browserify`, () => { return buildScript(t.entry, false); });
    gulp.task(`${t.name}-watchify`,   () => { return buildScript(t.entry, true);  });
}
gulp.task('typescript', gulp.parallel(targets.map(t => `${t.name}-browserify`)));
gulp.task('typescript:watch', gulp.parallel(targets.map(t => `${t.name}-watchify`)));

gulp.task('less', () => {
    return gulp.src('src/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'));
});

gulp.task('jade', () => {
    return gulp.src('src/**/*.jade')
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('app/html'));
});

gulp.task('img', () => {
    return gulp.src('src/img/sized/*.png')
        .pipe(gulp.dest('app/img'));
});

gulp.task('manifest', () => {
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

gulp.task('build', gulp.parallel(['typescript', 'less', 'jade', 'img', 'manifest']));

gulp.task('zip', () => {
    return version().then(function(version) {
        return gulp.src('app/**/*')
            .pipe(zip('compaito-' + version + '.zip'))
            .pipe(gulp.dest('releases'));
    });
});

gulp.task('package', gulp.series('build', 'zip'));

gulp.task('watch', () => {
    gulp.watch('src/**/*.ts',       gulp.parallel(['typescript']));
    gulp.watch('src/**/*.less',     gulp.parallel(['less']));
    gulp.watch('src/**/*.jade',     gulp.parallel(['jade']));
    gulp.watch('src/manifest.json', gulp.parallel(['manifest']));
});

gulp.task('default', gulp.series('build', 'watch'));
