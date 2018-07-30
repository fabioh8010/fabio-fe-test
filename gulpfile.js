const gulp = require('gulp')
const standard = require('gulp-standard')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const runSequence = require('run-sequence')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')

gulp.task('default', ['build'])

// Build tasks

gulp.task('build', function (callback) {
  runSequence('clean-dist-folder', ['hint-js', 'uglify-js', 'minify-html', 'minify-css', 'copy-images'], callback)
})

gulp.task('clean-dist-folder', function () {
  return gulp.src('dist')
    .pipe(clean())
})

gulp.task('hint-js', function () {
  return gulp.src('src/scripts/scripts.js')
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('uglify-js', function () {
  return gulp.src('src/scripts/scripts.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('minify-html', function () {
  return gulp.src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('minify-css', function () {
  return gulp.src('src/styles/styles.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styles'))
})

gulp.task('copy-images', function () {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'))
})

// Development tasks

gulp.task('serve', ['sass-serve'], function () {
  browserSync.init({
    server: 'src/'
  })

  gulp.watch('src/styles/styles.scss', ['sass-serve'])
  gulp.watch('src/scripts/scripts.js').on('change', browserSync.reload)
  gulp.watch('src/index.html').on('change', browserSync.reload)
})

gulp.task('sass-serve', function () {
  return gulp.src('src/styles/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream())
})
