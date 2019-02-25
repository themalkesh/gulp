var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var del = require('del');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

var filetorun = 'index.html';

var paths = {
   
    styles: {
        src: 'app/src/scss/**/*.scss',
        dest: 'app/build/css/'
    },
    scripts: {
        src: 'app/src/js/**/*.js',
        dest: 'app/build/js/'
    },
    images: {
        src: 'app/src/images/**/*.{jpg,jpeg,png}',
        dest: 'app/build/images/'
    },
    svgs: {
        src: 'app/src/images/**/*.svg',
        dest: 'app/build/images/'
    },
    htmls: {
        src: 'app/src/**/*.html',
        dest: 'app/build/'
    },
};


function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del([ 'build' ]);
}

function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function images() {
    return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.images.dest));
}

function svgs() {
    return gulp.src(paths.svgs.src, { sourcemaps: true })
    .pipe(gulp.dest(paths.svgs.dest));
}

function htmls() {
    return gulp.src(paths.htmls.src, { sourcemaps: true })
    .pipe(gulp.dest(paths.htmls.dest)); 
}

function watch(done) {
    gulp.watch(paths.scripts.src, gulp.series(scripts,reload));
    gulp.watch(paths.styles.src, gulp.series(styles,reload));
    gulp.watch(paths.images.src, gulp.series(images,reload));
    gulp.watch(paths.svgs.src, gulp.series(svgs,reload));
    gulp.watch(paths.htmls.src, gulp.series(htmls,reload));
    done();
}


function serve(done) {
    browserSync.init({
        server: {
            baseDir: "./app/build/"
        },
        startPath: filetorun
    });
    //browserSync.watch(paths.htmls.src).on("change", browserSync.reload);
    done()
}

function reload(done) {
    browserSync.reload();
    done()
}

var build = gulp.series(clean,htmls,styles,scripts,images,svgs, serve, watch, reload);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.svgs = svgs;
exports.htmls = htmls;
exports.serve = serve;
exports.watch = watch;
exports.build = build;
exports.default = build;