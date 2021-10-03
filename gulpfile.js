var gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		browserSync  = require('browser-sync'),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify-es').default,
		cleancss     = require('gulp-clean-css'),
		autoprefixer = require('gulp-autoprefixer'),
		rsync        = require('gulp-rsync'),
		newer        = require('gulp-newer'),
		rename       = require('gulp-rename'),
		responsive   = require('gulp-responsive'),
		del          = require('del'),
		rigger 			 = require('gulp-rigger');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('app/sass/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }))
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream())
});

// Scripts & JS Libraries
gulp.task('scripts', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js', // Optional jQuery plug-in (npm i --save-dev jquery)
		'node_modules/magic-grid/dist/magic-grid.min.js', // For gallerys, smt perfomance or just for blocks
		'app/libs/jquery.vide.min.js', // Video background
		'node_modules/sweetalert/dist/sweetalert.min.js', // Cool alert for modal windows
		'app/libs/slick.js', // Sliders
		'app/js/_lazy.js', // JS library plug-in example
		'app/js/_custom.js' // Custom scripts. Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// HTML Rigger
gulp.task('complite-html', function () {
	return gulp.src('app/html/*.html') //Выберем файлы по нужному пути
		.pipe(rigger()) //Прогоним через rigger
		.pipe(gulp.dest('build/')) //Выплюнем их в папку app
		.pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

// Responsive Images
gulp.task('img-responsive', async function() {
	return gulp.src('app/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('build/img/@1x'))
		.pipe(responsive({
			'*': [{
				// Produce @2x images
				width: '100%', quality: 90, rename: { prefix: '@2x/', },
			}, {
				// Produce @1x images
				width: '50%', quality: 90, rename: { prefix: '@1x/', }
			}]
		})).on('error', function () { console.log('No matching images found') })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('build/img'))
});
gulp.task('img', gulp.series('img-responsive', bsReload));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['build/img/@*'], { force: true })
});

// Code & Reload
gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

// Deploy
gulp.task('rsync', function() {
	return gulp.src('build/**')
	.pipe(rsync({
		root: 'build/',
		hostname: 'qastudio@85.119.149.127',
		destination: '/var/www/qastudio/data/www/qastudio.by',
		include: ['*.htaccess'], // Included files
		//exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});
// Clean
gulp.task('clean', function (cb) {
    del('build', cb);
});

// Fonts
gulp.task('fonts', function() {
	gulp.src('app/fonts/*.*')
		.pipe(gulp.dest('build/fonts/'))
});

// Video
gulp.task('video', function() {
	gulp.src('app/video/*')
		.pipe(gulp.dest('build/video/'))
});

// robots.txt, sitemap.xml, .htaccess
gulp.task('meta-files', function() {
	gulp.src(['app/*.*', 'app/*.htaccess'])
		.pipe(gulp.dest('build/'))
});

// PHP files
gulp.task('php', function() {
	gulp.src('app/js/*.php')
		.pipe(gulp.dest('build/js/'))
});

// Favicon
gulp.task('favicon', function() {
	gulp.src('app/img/*.{png,jpg,jpeg,webp,raw,ico,svg}')
		.pipe(gulp.dest('build/img/'))
});

// Build
gulp.task('build-all', gulp.parallel (
		'complite-html',
		'meta-files',
		'scripts',
		'favicon',
		'styles',
		'fonts',
		'video',
		'php',
		'img'
));

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch('app/html/**/*.html', gulp.parallel('complite-html'));
	gulp.watch(['libs/**/*.js', 'app/js/_custom.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gulp.watch('app/img/_src/**/*', gulp.parallel('img'));
	gulp.watch('app/img/*.*', gulp.parallel('favicon'));
});

gulp.task('default', gulp.parallel('build-all', 'browser-sync', 'watch'));