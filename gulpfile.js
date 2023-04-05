const gulp = require('gulp')
const concat = require('gulp-concat')

// adds all CSS files in SASS folder in one .CSS file
gulp.task('sass', function() {
  return gulp.src('static/sass/**/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('static/css'))
})

// Watch task to monitor changes in the SASS files
gulp.task('watch', function() {
  gulp.watch('static/sass/**/*.css', gulp.series('sass'))
})
