var gulp       = require('gulp'),
    browserify = require('browserify'),
    watchify   = require('watchify'),
    tsify      = require('tsify'),
    editJson   = require('gulp-json-editor'),
    less       = require('gulp-less'),
    pug        = require('gulp-pug'),
    zip        = require('gulp-zip'),
    logger     = require('gulp-logger'),
    gutil      = require('gulp-util'),
    source     = require('vinyl-source-stream'),
    path       = require('path'),
    exec       = require('child_process').exec,
    Promise    = require('es6-promise').Promise;

function buildScript(entry, watch) {
    let bundler = browserify({
        entries: entry,
        debug: true,
        plugin: [tsify],
        cache: {}, packageCache: {} // for watchify
    });

    function rebundle() {
        return bundler
            .bundle()
            .on('error', function(error) {
                gutil.log(error.toString());
                this.emit('end');
            })
            .pipe(source(path.basename(entry).replace(/\.ts$/, '.js')))
            .pipe(gulp.dest('app/js'))
            .pipe(logger({ beforeEach: '[ts] wrote: ' }));
    }

    // watchify を有効にする
    if (watch) {
        // watchify は file イベントによって追加されたファイルの更新をすべて update イベントで
        // 通知してしまう。 entry の依存に含まれるファイルの更新のみを検知して再生成したいため、
        // watchify が内部で検出している依存関係を proxy して依存の有無を判定できるようにする。
        let deps = {};
        bundler._options.cache = new Proxy(bundler._options.cache, {
            set: (cache, file, dep) => {
                cache[file] = dep;
                deps[file] = true;
            }
        });
        bundler.on('reset', () => { deps = {}; });
        bundler.on('update', (files) => {
            if (files.some((file) => { return deps[file]; })) rebundle();
        });

        bundler.plugin(watchify);
    }

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
        .pipe(gulp.dest('app/css'))
        .pipe(logger({ beforeEach: '[less] wrote: ' }));
});

gulp.task('pug', () => {
    return gulp.src('src/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('app/html'))
        .pipe(logger({ beforeEach: '[pug] wrote: ' }));
});

gulp.task('img', () => {
    return gulp.src('src/img/sized/*.png')
        .pipe(gulp.dest('app/img'))
        .pipe(logger({ beforeEach: '[img] wrote: ' }));
});

gulp.task('manifest', () => {
    return version().then(function(version) {
        return gulp.src('src/manifest.json')
            .pipe(editJson({ version : version }))
            .pipe(gulp.dest('app/'))
            .pipe(logger({ beforeEach: '[manifest] wrote: ' }));
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

gulp.task('build', gulp.parallel(['typescript', 'less', 'pug', 'img', 'manifest']));

gulp.task('zip', () => {
    return version().then(function(version) {
        return gulp.src('app/**/*')
            .pipe(zip('compaito-' + version + '.zip'))
            .pipe(gulp.dest('releases'));
    });
});

gulp.task('package', gulp.series('build', 'zip'));

gulp.task('watch', gulp.parallel(['typescript:watch', () => {
    gulp.watch('src/**/*.less',     gulp.parallel(['less']));
    gulp.watch('src/**/*.pug',      gulp.parallel(['pug']));
    gulp.watch('src/manifest.json', gulp.parallel(['manifest']));
}]));

gulp.task('default', gulp.series('build', 'watch'));
