var gulp   = require('gulp');
var gutil = require( 'gulp-util' );
var ftp = require('vinyl-ftp');
var config = require('../config');
 
gulp.task( 'deploy', function () {
    var conn = ftp.create( {
        host:     'os-developer.zzz.com.ua',
        user:     'serega1302@os-developer.zzz.com.ua',
        password: 'Serega1302',
        parallel: 10,
        log:      gutil.log
    } );
 
    var globs = [
        'build/**'
    ];
 
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
 
    return gulp.src( globs, { base: './build/', buffer: false } )
        .pipe( conn.newer( '/' ) ) // only upload newer files
        .pipe( conn.dest( '/' ) );
 
} );



