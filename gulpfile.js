const gulp = require('gulp')
const standard = require('gulp-standard')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const runSequence = require('run-sequence')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const spritesmith = require('gulp.spritesmith')
const merge = require('merge-stream')
const removeHtml = require('gulp-remove-html')

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
  return gulp.src('src/scripts/*.js')
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('minify-html', function () {
  return gulp.src('src/index.html')
    .pipe(removeHtml())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('sprite-icons', function () {
  var spriteData = gulp.src(['src/images/*.png', '!src/images/sprites.png'])
    .pipe(spritesmith({
      imgName: 'sprites.png',
      cssName: '_sprites.scss',
      imgPath: '../images/sprites.png'
    }))

  var imgStream = spriteData.img
    .pipe(gulp.dest('src/images'))

  var cssStream = spriteData.css
    .pipe(gulp.dest('src/styles'))

  return merge(imgStream, cssStream)
})

gulp.task('minify-css', ['sprite-icons'], function () {
  return gulp.src('src/styles/styles.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styles'))
})

gulp.task('copy-images', function () {
  return gulp.src(['src/images/*.jpg', 'src/images/sprites.png'])
    .pipe(gulp.dest('dist/images'))
})

// Development tasks

gulp.task('serve', ['sass-serve', 'sprite-icons-serve'], function () {
  browserSync.init({
    server: 'src/'
  })

  gulp.watch('src/styles/styles.scss', ['sass-serve'])
  gulp.watch(['src/images/*.png', '!src/images/sprites.png'], ['sprite-icons-serve'])
  gulp.watch('src/scripts/scripts.js').on('change', browserSync.reload)
  gulp.watch('src/index.html').on('change', browserSync.reload)
})

gulp.task('sass-serve', function () {
  return gulp.src('src/styles/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream())
})

gulp.task('sprite-icons-serve', function () {
  var spriteData = gulp.src(['src/images/*.png', '!src/images/sprites.png'])
    .pipe(spritesmith({
      imgName: 'sprites.png',
      cssName: '_sprites.scss',
      imgPath: '../images/sprites.png'
    }))

  var imgStream = spriteData.img
    .pipe(gulp.dest('src/images'))
    .pipe(browserSync.stream())

  var cssStream = spriteData.css
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream())

  return merge(imgStream, cssStream)
})
