var gulp = require("gulp");
var gutil = require("gulp-util");
var notify = require('gulp-notify');
var source = require("vinyl-source-stream");
var buffer = require('vinyl-buffer');
var browserify = require("browserify");
var watchify = require("watchify");
var babelify = require("babelify");
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');
var uglify = require('gulp-uglify');
var sass = require("gulp-sass");
var pump = require('pump');

var browserSync = require("browser-sync").create();

//var $ = require("jquery");

// ES6 babel compiler

var ENTRY_FILE = "./src/js/index.js";
var OUTPUT_DIR = "./src/js";
var OUTPUT_FILE = "babel.js";
var DELAY = 50;

gulp.task("watch", function () {
    var b = browserify({ entries: [ ENTRY_FILE ] }).transform(babelify);
    b.transform(babelify.configure({ presets: ["es2015"] }));

    function bundle() {
        b.bundle()
        .on("log", gutil.log)
        .on("error", notify.onError())
        .pipe(source(OUTPUT_FILE))
        .pipe(buffer())
        .pipe(gulp.dest(OUTPUT_DIR))
        .pipe(browserSync.reload({ stream: true }));
    }

    watchify(b, { delay: DELAY }).on("update", bundle);
    bundle();
});

// sass/scss file conversion

gulp.task('scss', function () {
    return gulp.src('./src/scss/foundation.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('build.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('./build/css/'));
});

// js file conversion

gulp.task('js', function(cb) {
    pump([
        gulp.src('./src/js/babel.js'),
            concat('bundle.js'),
            uglify(),
            gulp.dest('./build/js/')
        ],
        cb);
});

// browser sync, static server

gulp.task("serve", function () {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });

    gulp.watch('./src/scss/*.scss', ['scss']);
    gulp.watch('./src/js/babel.js', ['js']);
    gulp.watch(['./build/*.html', './build/css/*.css', './build/js/*.js']).on('change', browserSync.reload);
});

gulp.task("default", [ "watch", "serve" ]);
