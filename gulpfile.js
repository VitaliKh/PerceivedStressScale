
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const pug = require('gulp-pug');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = false;

gulp.task('clean', del.bind(null, ['.tmp', 'dist', 'app/index.html']));

gulp.task('serve', function() {
    runSequence(['clean'], ['styles', 'scripts', 'pug'/*, 'fonts'*/], function() {
        browserSync.init({
            notify: false,
            port: 9000,
            server: {
                baseDir: ['.tmp', 'app'],
                routes: {
                    '/bower_components': 'bower_components'
                }
            }
        });

        gulp.watch([
            'app/*.html',
            'app/styles/images/**/*',
            '.tmp/fonts/**/*'
        ]).on('change', reload);

        gulp.watch('app/styles/**/*.css', ['styles']);
        gulp.watch('app/scripts/**/*.js', ['scripts']);
        gulp.watch('app/fonts/**/*', ['fonts']);
        gulp.watch('app/views/**/*.pug', ['pug']);
    });
});

gulp.task('serve:dist', ['default'], function() {
    browserSync.init({
    notify: false,
    port: 9000,
    server: {
        baseDir: ['dist']
    }
    });
});

gulp.task('default', function() {
    return new Promise(function resolve() {
        dev = false;
        runSequence(['clean'], 'build', resolve);
    });
});

gulp.task('build', ['pug', 'html', 'images', 'extras'], function() {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('pug', function buildHTML() {
    return gulp.src('app/views/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.if(dev, $.sourcemaps.write('.')))
        .pipe($.if(dev, gulp.dest('.tmp/')))
        .pipe($.if(!dev, gulp.dest('app/')))
        .pipe(reload({stream: true}));
});

gulp.task('styles', function() {
    return gulp.src('app/styles/*.css')
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.if(dev, $.sourcemaps.write()))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.babel())
        .pipe($.if(dev, $.sourcemaps.write('.')))
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe(reload({stream: true}));
});

gulp.task('html', ['styles', 'scripts'], function() {
    return gulp.src('app/*.html')
        .pipe($.useref({searchPath: ['.tmp','app', '.']}))
        .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
        .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
        .pipe($.if(/\.html$/, $.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: {compress: {drop_console: true}},
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe(gulp.dest('dist/www'));
});

gulp.task('images', function() {
    return gulp.src('app/styles/images/**/*')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('dist/www/styles/images'));
});

gulp.task('extras', function() {
    return gulp.src([
        'app/*',
        '!app/*.html'
    ], {
        dot: true
    }).pipe($.if(/\.xml$/, gulp.dest('dist')))
        .pipe(gulp.dest('dist/www'));
});
