var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var sass        = require('gulp-sass');
var connect     = require('gulp-connect');
var open        = require('open');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var exorcist    = require('exorcist');

var sourcePaths = {
    styles: ['scss/**/*.scss'],
    src: ['src/**/*.js']
};

var distPaths = {
    styles: 'dist',
    js: 'dist'
};

var server = {
    host: 'localhost',
    port: '8001'
}

gulp.task('bundler', function(done) {
    // Single entry point to browserify
    browserify('src/index.js', {
            debug: true, standalone: "Tribute"
        })
        .transform(babelify)
        .bundle()
        .pipe(exorcist('dist/tribute.js.map'))
        .pipe(source('tribute.js'))
        .pipe(gulp.dest('dist'));
    done();
});

gulp.task('uglify', gulp.series('bundler', function(done) {
    gulp.src('dist/tribute.js')
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('dist'))
        .pipe(rename('tribute.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
    done();
}));

// Basic usage

gulp.task('sass', function(done) {
    gulp.src(sourcePaths.styles)
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(distPaths.styles));
    done();
});

gulp.task('webserver', function(done) {
    connect.server({
        root: '.',
        host: server.host,
        port: server.port,
        livereload: false,
    });
});

gulp.task('build', gulp.series('sass', 'uglify', function (done) {
    done();
}));

gulp.task('openbrowser', gulp.series('build', function(done) {
    open('http://' + server.host + ':' + server.port + '/example/index.html');
    done();
}));

gulp.task('watch', function(done) {
    gulp.watch(sourcePaths.styles, gulp.series('sass', function (done) {
        done();
    }));
    gulp.watch(sourcePaths.src, gulp.series('bundler', function (done) {
        done();
    }));
    done();
});

gulp.task('default', gulp.series('build', 'webserver', 'watch', 'openbrowser', function (done) {
    done();
}));
