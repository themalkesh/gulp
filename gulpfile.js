var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
const { watch, series } = require('gulp');

 

gulp.task('scss',function(done){
    gulp.src('./app/scss/*.scss').pipe(sass()).pipe(gulp.dest('./app/css'));
    //browserSync.reload();
    done();  
})


// gulp.task('jshint', function(done) {
//     gulp.src('./app/js/**/*.js')
//       .pipe(jshint())
//       .pipe(jshint.reporter('jshint-stylish'));
//       browserSync.reload();
//       done();
// });


gulp.task('reload',function(done){
    browserSync.reload();
    done();
})


gulp.task('serve',function(done){
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
    done();
})




gulp.task('default', gulp.parallel(['serve','scss'],function(done){  
    gulp.watch("./app/scss/*.scss",gulp.parallel(['scss'],function(done){
        browserSync.reload();
        done();
    }));
    // gulp.watch('./app/js/**/*.js', gulp.parallel(['jshint','reload'],function(done){
    //     done();
    // }));

    gulp.watch('./app/**/*.html', gulp.parallel(['reload'],function(done){
        //browserSync.reload();
        done();
    }));

    done();
})

    
);
  
  