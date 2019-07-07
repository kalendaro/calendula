/*eslint no-console: 0 */
const
    { dest, series, src } = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    paths = require('../paths'),
    localesPath = './src/json/locales/*.json';

function generateJS(cb) {
    glob.sync(localesPath)
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
                `${paths.dest}/locales/${name}.js`,
                `Calendula.addLocale(${text});`
            );
        });

    cb();
}

function copyJSON() {
    return src(localesPath)
        .pipe(dest(`${paths.dest}/locales`));
}

module.exports = series(copyJSON, generateJS);
