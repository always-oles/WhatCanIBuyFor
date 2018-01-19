const 
    gulp          = require('gulp'),
    GulpSSH       = require('gulp-ssh'),
    runSequence   = require('run-sequence'),
    config        = require('./gulp-config');

const gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: config
});


gulp.task('deploy-backend', () => {
    return gulp
            .src(['./backend/**', '!backend/node_modules/**'])
            .pipe(gulpSSH.dest('/var/www/html/backend/'))
            .pipe(gulpSSH.shell([`cd /var/www/html/backend/`, 'npm install', `pm2 restart whatcanibuyfor_server`]));
});

gulp.task('deploy-frontend', () => {
    return gulp
            .src(['./dist/**'])
            .pipe(gulpSSH.dest('/var/www/html/'));
});

// Copy all files from local environment to remote server
gulp.task('deploy', () => {
    runSequence(['deploy-backend', 'deploy-frontend']);
});