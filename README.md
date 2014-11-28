# Calendula
Особенный календарь на JavaScript

![Calendula](https://raw.githubusercontent.com/hcodes/calendula/master/examples/theme.default.png)

Возможности:
+ эргономичный дизайн;
+ отсутствие зависимостей от сторонних библиотек;
+ отложенная инициализация;
+ темы оформления;
+ подсветка праздничных дней: `ru`, `tr` и `uk`;
+ локализация;
+ анимация с помощью CSS;
+ поддержка тач-устройств.

Поддержка в браузерах:
+ Internet Explorer 9 и выше;
+ Mozilla Firefox 4 и выше;
+ Google Chrome 6 и выше;
+ Safari 6 и выше.

## Подключение
  ```HTML
<link rel="stylesheet" type="text/css" href="build/calendula.all.css" />
<script src="build/calendula.all.js"></script>
  ```
  
Для подключения только нужной локали и темы:
  ```HTML
<link rel="stylesheet" type="text/css" href="build/calendula.base.css" />
<link rel="stylesheet" type="text/css" href="build/calendula.ios.css" />
<script src="build/calendula.base.js"></script>
<script src="build/calendula.en.js"></script>
  ```

Или воспользуйтесь [инструментом для сборки](http://hcodes.github.io/calendula/index.ru.html).

## Использование
  ```JavaScript
var c = new Calendula({
  theme: 'ios',
  locale: 'fr',
  value: '2014-10-11'
  //...
});
  ```

| №  | Свойство  | Тип                  | По умолчанию  | Описание                                    |
|:---|:----------|:---------------------|:--------------|:--------------------------------------------|
| 1. | autocloseable | `Boolean`            | `true`        | Закрытие календаря при клике мимо него.     |
| 2. | switcher  | `DOMElement`         |               | Кнопка, при клике на которую открывается и позиционируется календарь. |
| 3. | closeAfterSelection| `Boolean`   | `true`        | Закрытие календаря при выборе даты.         |
| 4. | locale    | `String`             | `en`          | Язык интерфейса.<br>`be` `de` `en` `es` `fr` `it` `pl` `ru` `tr` `uk` |
| 5. | max       | `String`<br>`Date`<br>`Number` |               | Максимальная дата.                          |
| 6. | min       | `String`<br>`Date`<br>`Number` |               | Mинимальная дата.                           |
| 7. | theme     | `String`               | `default`     | Тема оформления.<br>`default` `black` `ios` `metro` `android`|
| 8. | value     | `String`<br>`Date`<br>`Number` | текущая дата   | Выбранная дата.                            |
| 9. | years     | `String`               | `-11:1`       | Установка диапозона для списка лет.         |

Поддерживаемые форматы дат:
 + `2014-11-22` `2014/11/22` `2014.11.22`
 + `22-11-2014` `22/11/2014` `22.11.2014`
 + `new Date(2014, 11, 12)`
 + `1418328000000`
 + `{day: 22, month: 10 /* 0-11 */, year: 2014}`



## API
### .open()
Открыть календарь.

### .close()
Закрыть календарь.

### .toggle()
Открыть/закрыть календарь.

### .isOpened()
Проверка открытия календаря.

### .setting(name, [value])
Получить/установить значение настройки.

### .event.on(type, callback)
Установка события.
  ```JavaScript
c.event.on('select', function(e, data) {
  console.log(data.day, data.month, data.year);
});
  ```

### .event.off(type, callback)
Снятие события.

### .destroy()
Уничтожить календарь: привязку событий, DOM-элементы и пр.



## События
### open
Календарь открыт.
  
  
### close
Календарь закрыт.

### select
Выбрана дата.


## Примеры
+ [Расширенный](http://hcodes.github.io/calendula/examples/api.html)
+ [Простой](http://hcodes.github.io/calendula/examples/simple.html)
+ [Все темы](http://hcodes.github.io/calendula/examples/many.html)
+ [Моя тема](http://hcodes.github.io/calendula/examples/my_theme.html)

## Пересборка
[Сборка на сайте](http://hcodes.github.io/calendula/index.ru.html)

Ручная сборка:
  ```
npm i
gulp
  ```

## [Лицензия](https://github.com/hcodes/calendula/blob/master/LICENSE.ru.md)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/hcodes/calendula/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

