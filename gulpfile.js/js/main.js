const
    { dest, src } = require('gulp'),
    rollup = require('rollup'),
    babel = require('rollup-plugin-babel'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    paths = require('../paths'),
    version = require('../../package.json').version,
    updateVersion = () => { return replace(/\{\{version\}\}/, version); };


function main() {
    return rollup.rollup({
        input: paths.js.main,
        output: {
            dir: './',
            file: 'cal.js',
            format: 'umd',
            name: 'Calendula'
        },
        plugins: [
            babel()
        ]
    }).then((data) => {
        data.write({
            file: `${paths.dest}/calendula.js`,
            format: 'umd',
            name: 'Calendula'
        });
    });
}

module.exports = main;
