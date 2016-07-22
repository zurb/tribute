var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var sass        = require('gulp-sass');
var webserver   = require('gulp-webserver');
var opn         = require('opn');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var uglify      = require('gulp-uglifyjs');

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

gulp.task('uglify', ['bundler'], function() {
    gulp.src('dist/tribute.js')
        .pipe(uglify('tribute.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
});

// Basic usage
gulp.task('bundler', function() {
    // Single entry point to browserify
    return browserify('src/index.js', {
            debug: true, standalone: "Tribute"
        })
        .transform(babelify)
        .bundle()
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        .pipe(source('tribute.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
    gulp.src(sourcePaths.styles)
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(distPaths.styles));
});

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            host: server.host,
            port: server.port,
            livereload: false,
            directoryListing: false
        }));
});

gulp.task('openbrowser', ['build'], function() {
    opn('http://' + server.host + ':' + server.port + '/example/index.html');
});

gulp.task('watch', function() {
    gulp.watch(sourcePaths.styles, ['sass']);
    gulp.watch(sourcePaths.src, ['bundler']);
});

gulp.task('build', ['sass', 'uglify']);

gulp.task('default', ['build', 'webserver', 'watch', 'openbrowser']);
