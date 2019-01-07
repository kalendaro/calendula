(function() {
    function leadZero(num) {
        return num < 10 ? '0' + num : num;
    }

    function formatDate(d) {
        return [
            d.getFullYear(),
            leadZero(d.getMonth() + 1),
            leadZero(d.getDate())
        ].join('-');
    }

    function log(text) {
        getByClass('.log__list').innerHTML += '<div class="log__item">' + text + '</div>';
    }

    function getById(id) {
        return document.getElementById(id);
    }

    function getByClass(selector) {
        return document.querySelector(selector);
    }

    var clLocale = getById('cl-locale');
    Calendula.getLocales().sort().forEach(function(el) {
        var opt = document.createElement('option');
        opt.value = opt.text = el;
        if (el === 'en') {
            opt.selected = true;
        }
        clLocale.add(opt);
    });

    function getPosition() {
        return clPositionLeft.value + ' ' + clPositionTop.value;
    }

    function getShowOn() {
        return clShowOn.value === 'both' ? ['click', 'focus'] : clShowOn.value;
    }

    var clOpen = getById('cl-open'),
        clClose = getById('cl-close'),
        clToggle = getById('cl-toggle'),
        clDestroy = getById('cl-destroy'),
        clTheme = getById('cl-theme'),
        clValue = getById('cl-value'),
        clValueSet = getById('cl-value-set'),
        clMin = getById('cl-min'),
        clMinSet = getById('cl-min-set'),
        clMax = getById('cl-max'),
        clMaxSet = getById('cl-max-set'),
        clAutocloseable = getById('cl-autocloseable'),
        clCloseAfterSelection = getById('cl-closeAfterSelection'),
        clDaysAfterMonths = getById('cl-daysAfterMonths'),
        clPositionLeft = getById('cl-position-left'),
        clPositionTop = getById('cl-position-top'),
        clShowOn = getById('cl-show-on'),
        clTitleText = getById('cl-title-text'),
        clTitleAdd = getById('cl-title-add'),
        clTitleDel = getById('cl-title-del'),
        clTitleColor = getById('cl-title-color'),
        clTitleAddDate = getById('cl-title-add-date'),
        clTitleDelDate = getById('cl-title-del-date'),
        button = getById('example-button'),
        minDate = new Date(),
        maxDate = new Date(),
        currentDate = new Date(),
        currentMonth = currentDate.getFullYear() + '-' + leadZero(currentDate.getMonth() + 1);

    minDate.setDate(1);
    minDate.setYear(minDate.getFullYear() - 5);
    maxDate.setDate(1);
    maxDate.setYear(maxDate.getFullYear() + 1);

    clValue.value = formatDate(new Date());
    clMin.value = formatDate(minDate);
    clMax.value = formatDate(maxDate);

    var cl = new Calendula({
        locale: clLocale.value,
        value: clValue.value,
        min: clMin.value,
        max: clMax.value,
        switcher: button,
        autocloseable: clAutocloseable.checked,
        daysAfterMonths: clDaysAfterMonths.checked,
        theme: clTheme.value,
        showOn: getShowOn(),
        position: getPosition(),
        title: [
            {date: currentMonth + '-10', text: 'Hello world!'},
            {date: currentMonth + '-11', color: 'red', text: 'Hello world!'},
            {date: currentMonth + '-12', color: 'orange', text: 'Hello world!'},
            {date: currentMonth + '-13', color: 'green', text: 'Hello world!'}
        ]
    });

    cl.on('select', function(e, data) {
        log(e.type + ' ' + JSON.stringify(data));
    }).on('open', function(e) {
        log(e.type);
    }).on('close', function(e) {
        log(e.type);
    });

    cl.open();

    clTheme.addEventListener('change', function() {
        cl.setting('theme', this.value);
        document.body.className = 'page page_theme_' + this.value;

        setTimeout(function() {
            cl.open();
        }, 300);
    }, false);

    clValueSet.addEventListener('click', function() {
        cl.val(clValue.value);
    }, false);

    clMinSet.addEventListener('click', function() {
        cl.setting('min', clMin.value);
    }, false);

    clMaxSet.addEventListener('click', function() {
        cl.setting('max', clMax.value);
    }, false);

    clPositionLeft.addEventListener('change', function() {
        cl.setting('position', getPosition());
        cl.open();
    });

    clPositionTop.addEventListener('change', function() {
        cl.setting('position', getPosition());
        cl.open();
    });

    clAutocloseable.addEventListener('change', function() {
        cl.setting('autocloseable', this.checked);
    }, false);

    clShowOn.addEventListener('change', function() {
        cl.setting('showOn', getShowOn());
    }, false);

    clCloseAfterSelection.addEventListener('change', function() {
        cl.setting('closeAfterSelection', this.checked);
    }, false);

    clDaysAfterMonths.addEventListener('change', function() {
        cl.setting('daysAfterMonths', this.checked);
    }, false);

    document.body.className = 'page page_theme_' + clTheme.value;

    clLocale.addEventListener('change', function() {
        cl.setting('locale', this.value);

        setTimeout(function() {
            cl.open();
        }, 300);
    }, false);

    clTitleAdd.addEventListener('click', function() {
        cl.title.set({
            text: clTitleText.value,
            color: clTitleColor.value,
            date: clTitleAddDate.value
        });
    }, false);

    clTitleDel.addEventListener('click', function() {
        cl.title.remove(clTitleDelDate.value);
    }, false);

    clOpen.addEventListener('click', function() {
        cl.open();
    }, false);

    clClose.addEventListener('click', function() {
        cl.close();
    }, false);

    clToggle.addEventListener('click', function() {
        cl.toggle();
    }, false);

    clDestroy.addEventListener('click', function() {
        cl.destroy();
    }, false);
})();
