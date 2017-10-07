const gulp = require('gulp');

gulp.task('build', () =>
    gulp.src(['src/**/*.js', '!src/**/__tests__/*'])
        .pipe(gulp.dest('./dist')));
