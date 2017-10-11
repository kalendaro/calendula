const
    fs = require('fs'),
    path = require('path'),
    glob = require('glob');

module.exports = {
    generateHolidays(dist) {
        glob.sync('./node_modules/kalendaro-holidays/*.json')
            .filter(file => file.search(/package\.json/) === -1)
            .map(file => {
                const
                    text = fs.readFileSync(file, 'utf-8'),
                    name = path.parse(file).name;

                try {
                    JSON.parse(text);
                } catch(e) {
                    console.error(`${file} - invalid JSON format.`);
                    throw e;
                }

                fs.writeFileSync(
                    `${dist}/calendula.holiday.${name}.js`,
                    `Calendula.addHolidays('${name}', ${text});`
                );
            });
    },
    generateLocales(dist) {
        glob.sync('./src/json/locales/*.json')
            .map(file => {
                const
                    text = fs.readFileSync(file, 'utf-8'),
                    name = path.parse(file).name;

                try {
                    JSON.parse(text);
                } catch(e) {
                    console.error(`${file} - invalid JSON format.`);
                    throw e;
                }

                fs.writeFileSync(
                    `${dist}/calendula.locale.${name}.js`,
                    `Calendula.addLocale('${name}', ${text});`
                );
            });
    }
};
