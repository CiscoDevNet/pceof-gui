/**
 * Created by dakuzma on 19. 2. 2016.
 */

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    del = require('del'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    runSequence = require('run-sequence'),
    open = require('gulp-open'),
    install = require("gulp-install");

var config = require( './build.config.js' );

// task for creating webserver
gulp.task('connect', function() {
    connect.server({
        root: config.build_dir,
        livereload: true,
        port: 9001
    });
});

// task for creating webserver
gulp.task('npm-bower-install', function() {
    gutil.log(gutil.colors.cyan('INFO :: running NPM && BOWER install'));
    return gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});



// open new tab in web browser
gulp.task('browser', function(){
    gutil.log(gutil.colors.cyan('INFO :: opening new browser tab'));
    return gulp.src(__filename)
        .pipe(open({uri: 'http://localhost:9001', app: 'chrome'}));
});

// task for jshint
gulp.task('lint', function() {
    return gulp.src(config.app_files.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// task for cleaning build directory
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del([config.build_dir]);
});

// task for cleaning assets css directory
gulp.task('assetCssClean', ['less'], function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['assets/css/**']);
});

/*gulp.task('scripts', ['clean'], function() {
    return gulp.src(paths.scripts)
        /!*.pipe(sourcemaps.init())
        .pipe(coffee())
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())*!/
        .pipe(gulp.dest('build/js'));

});

// Copy all static images
gulp.task('images', ['clean'], function() {
 return gulp.src(paths.images)
 // Pass in options to the task
 .pipe(imagemin({optimizationLevel: 5}))
 .pipe(gulp.dest('build/img'));
 });

gulp.task('html', ['clean'], function () {
    gulp.src(config.app_files.views)
        .pipe(connect.reload());
});*/

/* creating app css file from assets css without main.css */
gulp.task('appCss',  function () {
    return gulp.src(config.assets_files.css)
        .pipe(concat('app.css'))
        .pipe(gulp.dest('assets/css'));
});

/* task for minifying css in assets */
gulp.task('minifyCss', ['appCss'],function () {
    return gulp.src(['assets/css/app.css'].concat(config.app_files.css))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(config.build_dir + '/assets/css'));
});

/* default css task - grouping all necessary tasks */
gulp.task('css', function () {
    runSequence('assetCssClean', 'less', 'minifyCss');
});

// Compile CSS from LESS file
gulp.task('less', function () {
    gutil.log(gutil.colors.cyan('INFO :: compiling LESS file'));
    return gulp.src(config.app_files.less)
        .pipe(less())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('assets/css'));
});

// CSS task - copy assets
gulp.task('assets', ['css', 'assetsFonts'], function () {
    gutil.log(gutil.colors.cyan('INFO :: copying ASSETS files'));
    // Copy assets files
    return gulp.src(config.assets_files.js.concat(config.assets_files.package_fonts))
        .pipe(gulp.dest(config.build_dir + '/assets'));
});

/**
 * Copy assets fonts
 */
gulp.task('assetsFonts', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying Assets fonts files'));
    return gulp.src(config.assets_files.fonts)
        .pipe(gulp.dest(config.build_dir + '/assets/fonts'));
});

// HTML task - copy
gulp.task('copyHtml', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying HTML files'));
    // Copy html
    return gulp.src(config.app_files.templates.concat(config.app_files.html))
        .pipe(gulp.dest(config.build_dir));
});

/**
 * APP JS task - copy
 * Copy lib scripts, maintaining the original directory structure
 */
gulp.task('copyAppJs', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying APP JS files'));
    return gulp.src(config.app_files.js.concat(config.vendor_files.js))
        .pipe(gulp.dest(config.build_dir));
});

/**
 * APP JSON task - copy
 * Copy JSON app files
 */
gulp.task('copyAppJson', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying APP JSON files'));
    return gulp.src(config.app_files.json)
        .pipe(gulp.dest(config.build_dir));
});

/**
 * VENDOR files task - copy
 * Copy and minify vendor css files
 */
gulp.task('copyVendorCss', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying VENDOR css'));
    return gulp.src(config.vendor_files.css, { cwd : 'vendor/**' })
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(config.build_dir + '/assets/css'));
});

/**
 * VENDOR files task - copy
 * Copy vendor js files
 */
gulp.task('copyVendorJs', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying VENDOR js files'));
    return gulp.src(config.vendor_files.js, { cwd : 'vendor/**' })
        .pipe(gulp.dest(config.build_dir + '/vendor'))
        //reload browser TODO::refactor, position of this command, i think, is not correct
        .pipe(connect.reload());
});

/**
 * VENDOR files task - copy
 * Copy vendor fonts files
 */
gulp.task('copyVendorFonts', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying VENDOR fonts files'));
    return gulp.src(config.vendor_files.fonts)
        .pipe(gulp.dest(config.build_dir + '/assets/fonts'));
});

gulp.task('copyNextCiscoFonts', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying NeXt cisco fonts files'));
    return gulp.src(config.vendor_files.cisco_fonts)
        .pipe(gulp.dest(config.build_dir + '/assets/fonts/cisco'));
});


// Copy all other files to dist directly
gulp.task('copy', ['assets'], function() {
    runSequence(['copyHtml', 'copyAppJs', 'copyVendorCss', 'copyVendorFonts', 'copyNextCiscoFonts', 'copyAppJson'], 'copyVendorJs');
});

gulp.task('copyWebInfo', function() {
    return gulp.src(config.web_info_files).pipe(gulp.dest(config.build_dir + '/WEB-INF'));
});

// Reload browsers opened tabs
gulp.task('reload', function() {
    return gulp.src('*/*.*')
        .pipe(connect.reload());
});




// Rerun the task when a file changes
gulp.task('watch', function() {

    gulp.watch(config.app_files.js, function(){
        gutil.log(gutil.colors.cyan('INFO :: ******************* watch JS files *******************'));
        runSequence('copyAppJs', 'reload');
    });

    gulp.watch(config.app_files.templates.concat(config.app_files.html), function(){
        gutil.log(gutil.colors.cyan('INFO :: ******************* watch HTML files *******************'));
        runSequence('copyHtml', 'reload');
    });

    gulp.watch(config.app_files.less_files, function(){
        gutil.log(gutil.colors.cyan('INFO :: ******************* watch LESS files *******************'));
        runSequence('assetCssClean', 'less', 'minifyCss', 'reload');
    });

    /*gulp.watch(config.app_all_files, function(){
        runSequence('clean', ['lint','copy']);
    });

    gulp.watch(config.app_files.less_files, function(){
        runSequence(['lint', 'copy']);
    });*/
});

gulp.task('default', function(){
    runSequence(['clean','npm-bower-install'],'lint',['copy','connect', 'watch'], 'browser');
});

gulp.task('build', function(){
    runSequence('clean', 'copy', 'copyWebInfo');
});
