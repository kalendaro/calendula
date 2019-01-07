window.addEventListener('load', function() {
    var pages = [
        'simple',
        'many',
        'my_theme',
        'color_title',
        'api'
    ];

    var prev = pages[pages.length - 1], next = pages[1];

    pages.some(function(item, i) {
        prev = pages[i - 1] || pages[pages.length - 1];
        next = pages[i + 1] || pages[0];

        return location.pathname.search('/' + item + '\\.') > -1;
    });

    var nav = document.createElement('div');
    nav.innerHTML = '<div class="nav">\
        <a title="Github" href="https://github.com/kalendaro/calendula" class="button back">🏠</a>\
        <a title="Previous" href="./' + prev + '.html" class="button prev">◀</a>\
        <a title="Next" href="./' + next + '.html" class="button next">▶</a>\
        </div>';

    document.body.appendChild(nav);

    var stats = new Image();
    stats.src = 'https://mc.yandex.ru/watch/49603183';
}, false);
