const dest = './dist';

module.exports = {
    dest,
    css: {
        all: [
            'dist/calendula.css',
            'src/css/themes/*.scss'
        ],
        main: [ 'src/css/index.scss' ],
        themes: [ 'src/css/themes/*.scss' ]
    },
    js: {
        all: [
            `${dest}/locales/*.js`,
            `${dest}/holidays/*.js`
        ],
        locales: [ 'src/js/locale/*.js' ],
        main: 'src/js/main.js'
    }
};
