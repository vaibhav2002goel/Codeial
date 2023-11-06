// npm install --global gulp-cli
// npm install gulp -D 
// npm install gulp@4.0.2
// const gulp = require('gulp');
import gulp from 'gulp';


// npm install gulp-cssnano :: Used for compressing css files by writing the code in a single line
// const cssnano = require('gulp-cssnano');
import cssnano from "gulp-cssnano"


// npm i gulp-rev ::  This will rename the files with a hash along with the name
// const rev = require('gulp-rev');
import rev from "gulp-rev"


// npm install --save-dev gulp-uglify :: For minifying the js files
// npm i gulp-uglify-es
// const uglify = require('gulp-uglify-es').default;
import uglify from "gulp-uglify"


// npm install --save-dev gulp-imagemin :: For minifying the images
// const imagemin = require('gulp-imagemin');
import imagemin from 'gulp-imagemin';


// npm i del
// const del = require('del');
import del from 'del';
// import del from "del"


gulp.task('css', function(done){
    console.log('minifying css...');
   

     gulp.src('./assets/**/*.css')
     .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets')) // For using this in production mode make sure that environment variables have correct values so that our browser retrive files from this folder
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});





gulp.task('js', function(done){
    console.log('minifying js...');
     gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets')) // For using this in production mode make sure that environment variables have correct values so that our browser retrive files from this folder
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});


gulp.task('images', function(done){
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    // .pipe(rev())
    .pipe(gulp.dest('./public/assets')) // For using this in production mode make sure that environment variables have correct values so that our browser retrive files from this folder
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});



// empty the public/assets directory :: It will clear the previous build and will build it from scratch
gulp.task('clean:assets', async function(done){
    del.sync('./public/assets')
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});
// After doing this run :: gulp build :: command in terminal to run the gulp code




//   pipe() allows you to chain together various Gulp plugins and operations to transform files as they flow through the stream
//    gulp-rev plugin is used to rename the CSS and JavaScript files with a unique hash and create a manifest file (rev-manifest.json) that maps the original filenames to the new versioned filenames.