const {src, dest, parallel, series, watch} = require("gulp");
const sass = require("gulp-sass");
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const cleancss = require("gulp-clean-css");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const del = require("del");
const minify = require("gulp-minify");

function styles() {
    src("./src/css/**/*.css")
    .pipe(dest("./app/css"))
    return src("./src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: "expanded"
    }).on("error", notify.onError()))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(autoprefixer({
        cascade: false,
        flexbox: true
    }))
    .pipe(cleancss({
        level: 2
    }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./app/css/"))
    .pipe(browsersync.stream())
}

function scripts(){
    src("./src/js/**/*.min.js")
    .pipe(dest("./app/js"))
    return src(["./src/js/**/*.js", "!./src/js/**/*.min.js"])
    .pipe(minify({
        noSource: true
    }))
    .pipe(dest("./app/js"))
    .pipe(browsersync.stream())
}

function fonts(){
    src("./src/fonts/*.ttf")
    .pipe(ttf2woff())
    .pipe(dest("./app/fonts/"))
    return src("./src/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(dest("./app/fonts/"))
    .pipe(browsersync.stream())
}

function htmlInclude(){
    return src(["./src/index.html"])
    .pipe(fileinclude({
        prefix: "@",
        basepath: "@file"
    }))
    .pipe(dest("./app"))
    .pipe(browsersync.stream())
}

function imgToApp (){
    return src(["./src/img/*.{jpg,jpeg,png}"])
    .pipe(dest("./app/img"))
    .pipe(browsersync.stream())
}

function svgsprite(){
    return src("./src/img/*.svg")
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: "../sprite.svg"
            }
        }
    }))
    .pipe(dest("./app/img"))
    .pipe(browsersync.stream())
}

function clean(){
    return del(["./app/*"])
}

function watcher(){
    browsersync.init({
        server: {
            baseDir: "./app"
        }
    });

    watch("./src/scss/**/*.scss", styles);
    watch("./src/index.html", htmlInclude);
    watch("./src/img/*.{jpg,jpeg,png}", imgToApp);
    watch("./src/img/*.svg", svgSprite);
    watch("./src/fonts/*.ttf", fonts);
    watch("./src/js/*.js", scripts);
}

exports.styles = styles;
exports.watcher = watcher;
exports.scripts = scripts;
exports.default = series(clean, parallel(htmlInclude, imgToApp, svgsprite, scripts), fonts, styles, watcher);