var config = require('./config.js'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    clean = require('./util.js').clean,
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    browserify = require('browserify'),
    streamify = require('gulp-streamify'),
    source = require('vinyl-source-stream'),
    multiGlob = require('multi-glob'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    concatcss = require('gulp-concat-css'),
    recess = require('gulp-recess'),
    minify = require('gulp-minify-css');

var srcJsFiles = config.path.src.js,
    vendorJsFiles = config.path.vendor.js,
    srcStyleSheetFiles = config.path.src.css,
    srcTemplates = config.path.src.templates,
    srcIndexFile = config.path.src.index,
    srcSpecJsFiles = config.path.src.specs,
    distJsPath = config.path.dist.js,
    distStyleSheetPath = config.path.dist.css,
    distTemplatesPath = config.path.dist.templates,
    distIndexFilePath = config.path.dist.self,
    distSpecPath = config.path.dist.spec;

gulp.task('build-js', ['build-vendor-js', 'build-src-js', 'copy-specs-dist']);

gulp.task('build-vendor-js', function () {
    gulp.src(vendorJsFiles)
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(distJsPath))
        .on('end', function () {
            gutil.log('successfully copied vendor scripts')
        })
        .on('error', function (err) {
            gutil.log(err);
        });
});

gulp.task('build-src-js', ['lint-src-files-dist'], function () {
    var browserifyCallback = function (files) {
        browserify({entries: files})
            .transform('browserify-ngannotate')
            .bundle()
            .pipe(source("app.js"))
            .pipe(streamify(uglify()))
            .pipe(gulp.dest(distJsPath))
            .on('end', function () {
                gutil.log('successfully copied source scripts');
            })
            .on('error', function (err) {
                gutil.log(err);
            })
    };
    browserifyFiles(srcJsFiles, browserifyCallback);
});

gulp.task('build-css', function () {
    gulp.src(srcStyleSheetFiles)
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(recess())
        .pipe(concatcss('app.css'))
        .pipe(minify())
        .pipe(gulp.dest(distStyleSheetPath))
        .on('end', function () {
            gutil.log('successfully copied less files')
        })
        .on('error', onError);
});

gulp.task('build-templates', ['copy-templates-dist', 'copy-index-file-dist'])

gulp.task("copy-templates-dist", function () {
    gulp.src(srcTemplates)
        .pipe(gulp.dest(distTemplatesPath))
        .on('end', function () {
            gutil.log('successfully copied html files')
        })
        .on('error', onError);
});

gulp.task("copy-index-file-dist", function () {
    gulp.src(srcIndexFile)
        .pipe(gulp.dest(distIndexFilePath))
        .on('end', function () {
            gutil.log('successfully copied index file')
        })
        .on('error', onError);
});

gulp.task('copy-specs-dist', ['lint-spec-files-dist'], function () {
    function browserifySpecCallback(files) {
        browserify({entries: files})
            .bundle()
            .pipe(source("spec.js"))
            .pipe(gulp.dest(distSpecPath))
            .on('error', onError);
    };

    browserifyFiles(srcSpecJsFiles, browserifySpecCallback);
});

gulp.task('run-dist-server', function () {
    connect.server({
        root: [config.path.dist.self],
        port: 8001
    });
});

gulp.task('lint-spec-files-dist', function () {
    lint("spec/**/*.js");
});

gulp.task('lint-src-files-dist', function () {
    gulp.src(srcJsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', function (err) {
            gutil.log('----------------------------');
            gutil.log("Failed to build js files.");
            gutil.log('----------------------------');
            process.exit(1);
        });

});

function browserifyFiles(srcGlob, browserifyCallback) {
    multiGlob.glob(srcGlob, function (err, files) {
        files = files.map(prefixFileName);
        browserifyCallback(files);
    });
};

function prefixFileName(fileName) {
    return "./" + fileName;
}

function lint(files) {
    gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
}

function onError(err) {
    gutil.log('----------------------------');
    gutil.log(err.message);
    gutil.log('----------------------------');
}