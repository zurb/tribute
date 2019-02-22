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

gulp.task('bundler', function(done) {
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
    done();
});

gulp.task('uglify', gulp.series('bundler', function(done) {
    gulp.src('dist/tribute.js')
        .pipe(uglify('tribute.min.js', {
            outSourceMap: true
        }))
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
    gulp.src('.')
        .pipe(webserver({
            host: server.host,
            port: server.port,
            livereload: false,
            directoryListing: false
        }));
    done();
});

gulp.task('build', gulp.series('sass', 'uglify', function (done) {
    done();
}));

gulp.task('openbrowser', gulp.series('build', function(done) {
    opn('http://' + server.host + ':' + server.port + '/example/index.html');
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
