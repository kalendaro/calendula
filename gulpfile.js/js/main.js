const
    fs = require('fs'),
    { series } = require('gulp'),
    rollup = require('rollup'),
    babel = require('rollup-plugin-babel'),
    paths = require('../paths'),
    version = require('../../package.json').version,
    mainJs = `${paths.dest}/calendula.js`;


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
    }).then((data) => data.write({
        file: mainJs,
        format: 'umd',
        name: 'Calendula'
    }));
}

function updateVersion(cb) {
    const source  = fs.readFileSync(mainJs, 'utf8').replace(/\{\{version\}\}/, version);
    fs.writeFileSync(mainJs, source);

    cb();
}

module.exports = series(main, updateVersion);
