const gulp = require('gulp');
const strip = require('gulp-strip-comments');

const statics = ['src/*.json', 'src/**/*.json', 'src/*/www', 'src/*/*.txt'];


gulp.task('scripts', () => {
  return gulp.src('src/**/*.js')
    .pipe(strip())
    .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['scripts'], () => {
  gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('statics', function () {
  return gulp.src(statics)
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['scripts', 'statics']);
gulp.task('watch', ['dev', 'statics']);
