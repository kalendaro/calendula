/*eslint no-console: 0 */
const
    { dest, series, src } = require('gulp'),
    del = require('del'),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    paths = require('../paths'),
    holidaysPath = './node_modules/kalendaro-holidays/*.json';

function generateJs(cb) {
    glob.sync(holidaysPath)
        .filter(file => file.search(/package\.json/) === -1)
        .map(file => {
            const
                text = fs.readFileSync(file, 'utf-8'),
                name = path.parse(file).name;

            try {
                JSON.parse(text);
            } catch (e) {
                console.error(`${file} - invalid JSON format.`);
                throw e;
            }

            fs.writeFileSync(
                `${paths.dest}/holidays/${name}.js`,
                `Calendula.addHolidays('${name}', ${text});`
            );
        });

    cb();
}

function copyJSON() {
    return src(holidaysPath)
        .pipe(dest(`${paths.dest}/holidays`));
}

function delPackage() {
    return del(`${paths.dest}/holidays/package.json`);
}

module.exports = series(copyJSON, delPackage, generateJs);
