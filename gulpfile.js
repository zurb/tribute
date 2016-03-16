var gulp      = require('gulp');
var plumber   = require('gulp-plumber');
var sass      = require('gulp-sass');
var webserver = require('gulp-webserver');
var opn       = require('opn');
var babel     = require('gulp-babel');

var sourcePaths = {
  styles: ['scss/**/*.scss'],
  es6: ['js/**/*.js']
};

var distPaths = {
  styles: 'dist',
  js: 'dist'
};

var server = {
  host: 'localhost',
  port: '8001'
}

gulp.task('sass', function () {
  gulp.src( sourcePaths.styles )
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest( distPaths.styles ));
});

gulp.task('webserver', function() {
  gulp.src( '.' )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       false,
      directoryListing: false
    }));
});

gulp.task('es6', function () {
	return gulp.src(sourcePaths.es6)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(distPaths.js));
});

gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port + '/example/index.html' );
});

gulp.task('watch', function(){
  gulp.watch(sourcePaths.styles, ['sass']);
  gulp.watch(sourcePaths.es6, ['es6']);
});

gulp.task('build', ['sass', 'es6']);

gulp.task('default', ['build', 'webserver', 'watch', 'openbrowser']);
