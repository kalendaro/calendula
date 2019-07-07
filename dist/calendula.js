(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Calendula = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * Is a string?
   * @param {*} obj
   * @returns {boolean}
   */
  function isString(obj) {
    return typeof obj === 'string';
  }
  /**
   * Is a number?
   * @param {*} obj
   * @returns {boolean}
   */

  function isNumber(obj) {
    return typeof obj === 'number';
  }
  /**
   * Is a undefined?
   * @param {*} obj
   * @returns {boolean}
   */

  function isUndefined(obj) {
    return typeof obj === 'undefined';
  }
  /**
   * Is a object?
   * @param {*} obj
   * @returns {boolean}
   */

  function isObject(obj) {
    return _typeof(obj) === 'object';
  }
  /**
   * Is plain object?
   * @param {*} obj
   * @returns {boolean}
   */

  function isPlainObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  /**
   * Get offset of element.
   *
   * @param {DOMElement} el
   * @returns {Object}
   */

  function getOffset(el) {
    var box = {
      top: 0,
      left: 0
    }; // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)

    if (el && !isUndefined(el.getBoundingClientRect)) {
      box = el.getBoundingClientRect();
    }

    return {
      top: box.top + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
      left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
    };
  }
  /**
   * Set position of element.
   *
   * @param {DOMElement} elem
   * @param {Object} coords
   * @param {string|number} coords.left
   * @param {string|number} coords.top
   */

  function setPosition(elem, coords) {
    var left = coords.left;
    var top = coords.top;
    elem.style.left = isNumber(left) ? left + 'px' : left;
    elem.style.top = isNumber(top) ? top + 'px' : top;
  }
  /**
   * Set translateY.
   *
   * @param {DOMElement} el
   * @param {string|number} top
   */

  function setTranslateY(el, top) {
    el.style.transform = 'translateY(' + (isNumber(top) ? top + 'px' : top) + ')';
  }
  /**
   * Get window area.
   *
   * @returns {Object}
   */

  function getWindowArea() {
    var docElement = document.documentElement,
        pageX = window.pageXOffset,
        pageY = window.pageYOffset;
    return {
      x1: pageX,
      y1: pageY,
      x2: pageX + docElement.clientWidth,
      y2: pageY + docElement.clientHeight
    };
  }

  var bestPositions = [['left', 'bottom'], ['left', 'top'], ['right', 'bottom'], ['right', 'top'], ['center', 'bottom'], ['center', 'top']];

  function getIntersection(d1, d2, d3, d4) {
    if (d2 <= d3 || d1 >= d4) {
      return 0;
    }

    return Math.min(d2, d4) - Math.max(d1, d3);
  }

  function calcVisibleSquare(coords, popup) {
    var conArea = {
      x1: coords.left,
      y1: coords.top,
      x2: coords.left + popup.offsetWidth,
      y2: coords.top + popup.offsetHeight
    },
        windowArea = getWindowArea(),
        width = getIntersection(conArea.x1, conArea.x2, windowArea.x1, windowArea.x2),
        height = getIntersection(conArea.y1, conArea.y2, windowArea.y1, windowArea.y2);
    return width * height;
  }

  function isAuto(prop) {
    return prop === 'auto' || isUndefined(prop);
  }
  function calcPosition(coords, popup, switcher) {
    var switcherOffset = getOffset(switcher);
    var left = switcherOffset.left,
        top = switcherOffset.top;

    if (isString(coords.left)) {
      switch (coords.left) {
        case 'center':
          left += (switcher.offsetWidth - popup.offsetWidth) / 2;
          break;

        case 'right':
          left += switcher.offsetWidth - popup.offsetWidth;
          break;
      }
    }

    if (isString(coords.top)) {
      switch (coords.top) {
        case 'top':
          top -= popup.offsetHeight;
          break;

        case 'center':
          top -= (popup.offsetHeight - switcher.offsetHeight) / 2;
          break;

        case 'bottom':
          top += switcher.offsetHeight;
          break;
      }
    }

    return {
      left: left,
      top: top
    };
  }
  function calcBestPosition(coords, popup, switcher) {
    var isLeftAuto = isAuto(coords.left),
        isTopAuto = isAuto(coords.top);
    var maxArea = -1,
        index = 0;
    bestPositions.forEach(function (item, i) {
      var coordsItem = {
        left: item[0],
        top: item[1]
      };

      if (isLeftAuto && isTopAuto || isLeftAuto && coordsItem.top === coords.top || isTopAuto && coordsItem.left === coords.left) {
        var offset = calcPosition(coords, popup, switcher),
            area = calcVisibleSquare(offset, popup);

        if (area > maxArea) {
          maxArea = area;
          index = i;
        }
      }
    });

    var _bestPositions$index = _slicedToArray(bestPositions[index], 2),
        left = _bestPositions$index[0],
        top = _bestPositions$index[1];

    return {
      left: left,
      top: top
    };
  }

  /**
   * Add a leading zero.
   *
   * @param {number} value
   * @returns {string}
   */

  function leadZero(value) {
    return (value < 10 ? '0' : '') + value;
  }
  /**
   * Convert a date to ISO format.
   *
   * @param {number} year
   * @param {number} month - 0-11
   * @param {number} day
   * @returns {string}
   */

  function ymdToISO(year, month, day) {
    return [year, leadZero(month + 1), leadZero(day)].join('-');
  }
  /**
   * Parse a date.
   *
   * @param {string|number|Date} value
   * @returns {Date}
   */

  function parseDate(value) {
    var date = null,
        match,
        buffer;

    if (value) {
      if (isString(value)) {
        if (value === 'today') {
          return new Date();
        }

        match = /^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(value);

        if (match) {
          buffer = [match[3], match[2], match[1]];
        } else {
          match = /^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(value);

          if (match) {
            buffer = [match[1], match[2], match[3]];
          }
        }

        if (buffer) {
          date = new Date(parseInt(buffer[2], 10), parseInt(buffer[1] - 1, 10), parseInt(buffer[0], 10));
        }
      } else if (isObject(value)) {
        if (value instanceof Date) {
          date = value;
        } else if (value.year && value.day) {
          date = new Date(value.year, value.month, value.day, 12, 0, 0, 0);
        }
      } else if (isNumber(value)) {
        date = new Date(value);
      }
    }

    return date;
  }
  /**
   * Parse a date and convert to ISO format.
   *
   * @param {string|number|Date} value
   * @returns {string|null}
   */

  function parseDateToISO(value) {
    var date = parseDate(value);
    return date ? [date.getFullYear(), leadZero(date.getMonth() + 1), leadZero(date.getDate())].join('-') : null;
  }
  /**
   * Convert a date to a object.
   *
   * @param {string|number|Date} value
   * @returns {Object}
   */

  function parseDateToObj(value) {
    var date = parseDate(value);
    return date ? {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    } : {};
  }
  /**
   * Get current date.
   *
   * @returns {Object}
   */

  function getCurrentDate() {
    var date = new Date();
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    };
  }

  var keyCodes = {
    ESC: 27,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    CURSOR_UP: 38,
    CURSOR_DOWN: 40,
    CURSOR_LEFT: 37,
    CURSOR_RIGHT: 39
  };

  var MAX_MONTH = 11;
  var MIN_MONTH = 0;
  var SATURDAY = 6;
  var SUNDAY = 0;

  /**
   * Extension: Event
   */
  var EventEmitter =
  /*#__PURE__*/
  function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      this._events = {};
    }
    /**
     * Attach a handler to an custom event.
     *
     * @param {string} type
     * @param {Function} callback
     * @returns {Event} this
     */


    _createClass(EventEmitter, [{
      key: "on",
      value: function on(type, callback) {
        if (type && callback) {
          this._events[type] = this._events[type] || [];

          this._events[type].push({
            type: type,
            callback: callback
          });
        }

        return this;
      }
      /**
       * Remove a previously-attached custom event handler.
       *
       * @param {string} type
       * @param {Function} callback
       * @returns {Event} this
       */

    }, {
      key: "off",
      value: function off(type, callback) {
        if (this._events[type]) {
          this._events[type] = this._events[type].filter(function (item) {
            return callback !== item.callback;
          });
        }

        return this;
      }
      /**
       * Execute all handlers for the given event type.
       *
       * @param {string} type
       * @param {*} [data]
       * @returns {Event} this
       */

    }, {
      key: "trigger",
      value: function trigger(type, data) {
        var _this = this;

        if (this._events[type]) {
          this._events[type].forEach(function (item) {
            if (type === item.type) {
              item.callback.call(_this, {
                type: type
              }, data);
            }
          });
        }

        return this;
      }
    }]);

    return EventEmitter;
  }();

  function bem(b, e, m, val) {
    return b + (e ? '__' + e : '') + (m ? '_' + m + (val === '' ? '' : '_' + val) : '');
  }

  var Block =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inherits(Block, _EventEmitter);

    function Block() {
      _classCallCheck(this, Block);

      return _possibleConstructorReturn(this, _getPrototypeOf(Block).apply(this, arguments));
    }

    _createClass(Block, [{
      key: "e",

      /**
       * Build CSS class for element.
       *
       * @param {string} e
       * @param {string} [m]
       * @param {string} [val]
       * @returns {string}
       */
      value: function e(_e, m, val) {
        if (val === null || val === false) {
          m = '';
        } else if (val === true || val === undefined) {
          val = '';
        }

        return bem(this._name, _e, m, val);
      }
      /**
       * Build CSS class for mod.
       *
       * @param {string} m
       * @param {string} [val]
       * @returns {string}
       */

    }, {
      key: "m",
      value: function m(_m, val) {
        if (val === null || val === false) {
          _m = '';
        } else if (val === true || val === undefined) {
          val = '';
        }

        return bem(this._name, '', _m, val);
      }
      /**
       * Remove mod from DOM element.
       *
       * @param {DOMElement} dom
       * @param {string} m
       * @returns {this}
       */

    }, {
      key: "delMod",
      value: function delMod(dom, m) {
        var e = this.getElemName(dom),
            selector = e ? this.e(e, m) : this.m(m),
            classes = (dom.className || '').split(' ');
        classes.forEach(function (cl) {
          if (cl === selector || cl.search(selector + '_') !== -1) {
            dom.classList.remove(cl);
          }
        });
        return this;
      }
      /**
       * Set mod for DOM element.
       * @param {DOMElement} dom
       * @param {string} m
       * @param {string|boolean} [val]
       * @returns {this}
       */

    }, {
      key: "setMod",
      value: function setMod(dom, m, val) {
        var e = this.getElemName(dom);
        this.delMod(dom, m);
        dom.classList.add(e ? this.e(e, m, val) : this.m(m, val));
        return this;
      }
      /**
       * Has a mod?
       *
       * @param {DOMElement} dom
       * @param {string} m
       * @param {string|boolean} [val]
       * @returns {boolean}
       */

    }, {
      key: "hasMod",
      value: function hasMod(dom, m, val) {
        var e = this.getElemName(dom);
        return dom.classList.contains(e ? this.e(e, m, val) : this.m(m, val));
      }
      /**
       * Has a element?
       *
       * @param {DOMElement} dom
       * @param {string} e
       * @returns {boolean}
       */

    }, {
      key: "hasElem",
      value: function hasElem(dom, e) {
        return dom.classList.contains(this.e(e));
      }
      /**
       * Get name for element.
       *
       * @param {DOMElement} dom
       * @returns {string}
       */

    }, {
      key: "getElemName",
      value: function getElemName(dom) {
        var result = dom.className.match(/__([^ _$]+)/);
        return result ? result[1] : '';
      }
      /**
       * Find a element by name.
       *
       * @param {DOMElement} e
       * @param {string} m
       * @param {string|boolean} [val]
       * @returns {string}
       */

    }, {
      key: "findElem",
      value: function findElem(e, m, val) {
        return this._dom.querySelector('.' + this.e(e, m, val));
      }
      /**
       * Find a element by name in context.
       *
       * @param {DOMElement} dom
       * @param {DOMElement} e
       * @param {string} m
       * @param {string|boolean} [val]
       * @returns {string}
       */

    }, {
      key: "findElemContext",
      value: function findElemContext(dom, e, m, val) {
        return dom.querySelector('.' + this.e(e, m, val));
      }
      /**
       * Find all elements by name.
       *
       * @param {DOMElement} dom
       * @param {string} m
       * @param {string|boolean} [val]
       * @returns {string}
       */

    }, {
      key: "findElemAll",
      value: function findElemAll(dom, m, val) {
        return this._dom.querySelectorAll('.' + this.e(dom, m, val));
      }
      /**
       * Find all elements by name in context.
       *
       * @param {DOMElement} context
       * @param {string} e
       * @param {string} [m]
       * @param {string|boolean} [val]
       * @returns {string}
       */

    }, {
      key: "findElemAllContext",
      value: function findElemAllContext(context, e, m, val) {
        return context.querySelectorAll('.' + this.e(e, m, val));
      }
    }]);

    return Block;
  }(EventEmitter);

  var Calendula =
  /*#__PURE__*/
  function (_Block) {
    _inherits(Calendula, _Block);

    function Calendula(rawParams) {
      var _this;

      _classCallCheck(this, Calendula);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Calendula).call(this, rawParams));

      var params = Calendula.extend({}, rawParams || {}),
          years = _this._prepareYears(params.years);

      _this.params = Calendula.extend(params, {
        autocloseable: isUndefined(params.autocloseable) ? true : params.autocloseable,
        closeAfterSelection: isUndefined(params.closeAfterSelection) ? true : params.closeAfterSelection,
        locale: params.locale || 'en',
        max: parseDateToObj(params.max),
        min: parseDateToObj(params.min),
        maxColor: params.maxColor || 5,
        showOn: params.showOn || 'click',
        theme: params.theme || 'default',
        startYear: years.start,
        endYear: years.end
      });
      _this._name = 'calendula';

      _this._initExtensions();

      _this.val(_this.setting('value'));

      _this._addSwitcherEvents(_this.setting('showOn'));

      return _this;
    }
    /**
     * Extend a object.
     *
     * @param {Object} dest
     * @param {Object} source
     * @returns {Object}
     */


    _createClass(Calendula, [{
      key: "isOpened",

      /**
       * Is opened popup?
       *
       * @returns {boolean}
       */
      value: function isOpened() {
        return this._isOpened;
      }
      /**
       * Open popup.
       *
       * @returns {Calendula} this
       */

    }, {
      key: "open",
      value: function open() {
        var _this2 = this;

        this._init();

        if (!this.isOpened()) {
          this.timeout.clearAll(['open', 'close']).set(function () {
            _this2.setMod(_this2._dom, 'opened', true);

            _this2._update();

            _this2._monthSelector(_this2._currentDate.month, false);

            _this2._yearSelector(_this2._currentDate.year, false);

            _this2._openedEvents();
          }, 0, 'open');
          this._isOpened = true;
          this.trigger('open');
        }

        return this;
      }
      /**
       * Close popup.
       *
       * @returns {Calendula} this
       */

    }, {
      key: "close",
      value: function close() {
        var _this3 = this;

        this._init();

        if (this.isOpened()) {
          this.timeout.clearAll(['open', 'close']).set(function () {
            _this3.timeout.clearAll('open');

            _this3._update();

            _this3._delOpenedEvents();

            _this3.delMod(_this3._dom, 'opened');

            _this3.tooltip.hide();

            _this3.trigger('close');
          }, 0, 'close');
          this._isOpened = false;
        }

        return this;
      }
      /**
       * Open/close popup.
       *
       * @returns {Calendula} this
       */

    }, {
      key: "toggle",
      value: function toggle() {
        return this.isOpened() ? this.close() : this.open();
      }
      /**
       * Get/set value.
       *
       * @param {string|number|Date} [value]
       * @returns {*}
       */

    }, {
      key: "val",
      value: function val(value) {
        if (!arguments.length) {
          return this._val;
        }

        if (value) {
          this._val = parseDateToObj(value);
          this._currentDate = Calendula.extend({}, this._val);
        } else {
          this._val = {};
          this._currentDate = getCurrentDate();
        }

        if (this._dom) {
          this._updateSelection();
        }

        this._updateSwitcher();
      }
      /**
       * Get/set a setting.
       *
       * @param {string} name
       * @param {string} [value]
       * @returns {*}
       */

    }, {
      key: "setting",
      value: function setting(name, value) {
        var dom = this._dom;

        if (arguments.length === 1) {
          return this.params[name];
        }

        this.params[name] = ['min', 'max', 'value'].indexOf(name) > -1 ? parseDateToObj(value) : value;

        if (name === 'showOn') {
          this._addSwitcherEvents(value);
        }

        if (dom) {
          if (name === 'theme') {
            this.setMod(dom, 'theme', value);
          } else if (name === 'daysAfterMonths') {
            if (value) {
              this.setMod(dom, 'days-after-months');
            } else {
              this.delMod(dom, 'days-after-months');
            }
          }

          if (name === 'position') {
            this.isOpened() && this._position(value);
          }

          if ({
            min: true,
            max: true,
            locale: true
          }[name]) {
            this._rebuild();
          }
        }

        return this;
      }
      /**
       * Destroy the datepicker.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        if (!this._isInited) {
          return;
        }

        delete this._events;
        this.close();

        this._destroyExtensions();

        document.body.removeChild(this._dom);
        this.params = null;
        this._dom = null;
        this._isInited = null;
      }
    }, {
      key: "_init",
      value: function _init() {
        if (this._isInited) {
          return;
        }

        this._isInited = true;
        var id = this.setting('id'),
            dom = document.createElement('div');
        dom.className = this._name;

        if (id) {
          dom.id = id;
        }

        this._dom = dom;
        this.setMod(dom, 'theme', this.setting('theme'));

        if (this.setting('daysAfterMonths')) {
          this.setMod(dom, 'days-after-months');
        }

        this._rebuild();

        document.body.appendChild(dom);
      }
    }, {
      key: "_position",
      value: function _position(pos) {
        var _split = (pos || '').split(' '),
            _split2 = _slicedToArray(_split, 2),
            left = _split2[0],
            top = _split2[1];

        var switcher = this.setting('switcher');
        var coords = {
          left: left,
          top: top
        };

        if (switcher && (isAuto(coords.left) || isAuto(coords.top))) {
          coords = calcBestPosition(coords, this._dom, switcher);
        }

        setPosition(this._dom, calcPosition(coords, this._dom, switcher));
      }
    }, {
      key: "_update",
      value: function _update() {
        this._init();

        this._position(this.setting('position'));
      }
    }, {
      key: "_findDayByDate",
      value: function _findDayByDate(date) {
        if (date.year !== this._currentDate.year) {
          return null;
        }

        var month = this.findElemAll('days-month')[date.month];

        if (month) {
          var day = this.findElemAllContext(month, 'day')[date.day - 1];
          return day || null;
        }

        return null;
      }
    }, {
      key: "_onresize",
      value: function _onresize() {
        this._update();
      }
    }, {
      key: "_onscroll",
      value: function _onscroll() {
        this._update();
      }
    }, {
      key: "_rebuild",
      value: function _rebuild() {
        var isOpened = this.isOpened();

        if (isOpened) {
          this._delOpenedEvents();
        }

        this._dom.innerHTML = this.template.get('main');

        if (isOpened) {
          this._openedEvents();

          this._monthSelector(this._currentDate.month, false);

          this._yearSelector(this._currentDate.year, false);
        }
      }
    }, {
      key: "_rebuildDays",
      value: function _rebuildDays() {
        this.findElem('days-container').innerHTML = this.template.get('days');

        this._monthSelector(this._currentDate.month, false);
      }
    }, {
      key: "_intoContainer",
      value: function _intoContainer(target) {
        var node = target;

        while (node) {
          if (node === this._dom) {
            return true;
          }

          node = node.parentNode;
        }

        return false;
      }
    }, {
      key: "_openedEvents",
      value: function _openedEvents() {
        var _this4 = this;

        this.domEvent.on(document, 'click', function (e) {
          if (e.button || !_this4.setting('autocloseable')) {
            return;
          }

          if (e.target !== _this4.setting('switcher') && !_this4._intoContainer(e.target)) {
            _this4.close();
          }
        }, 'open');
        this.domEvent.on(window, 'resize', function () {
          _this4._onresize();
        }, 'open').on(document, 'scroll', function () {
          _this4._onscroll();
        }, 'open').on(document, 'keypress', function (e) {
          var cd = _this4._currentDate;

          switch (e.keyCode) {
            case keyCodes.ESC:
              _this4.close();

              break;

            case keyCodes.PAGE_DOWN:
              if (e.ctrlKey || e.altKey) {
                _this4._monthSelector(cd.month + 1, true);
              } else {
                _this4._yearSelector(cd.year + 1, true);
              }

              e.preventDefault();
              break;

            case keyCodes.PAGE_UP:
              if (e.ctrlKey || e.altKey) {
                _this4._monthSelector(cd.month - 1, true);
              } else {
                _this4._yearSelector(cd.year - 1, true);
              }

              e.preventDefault();
              break;
          }
        }, 'open').on(this._dom, 'click', function (e) {
          if (e.button) {
            return;
          }

          _this4.tooltip.hide();
        }, 'open');
        var days = this.findElem('days'),
            months = this.findElem('months'),
            years = this.findElem('years');

        this._onwheelmonths = function (e) {
          var delta = _this4._getDeltaY(e);

          if (delta) {
            _this4._monthSelector(_this4._currentDate.month + delta, true);

            e.preventDefault();
          }
        };

        this._onwheelyears = function (e) {
          var delta = _this4._getDeltaY(e);

          if (delta) {
            _this4._yearSelector(_this4._currentDate.year + delta, true);

            e.preventDefault();
          }
        };

        this.domEvent.on(days, 'wheel', this._onwheelmonths, 'open').on(months, 'wheel', this._onwheelmonths, 'open').on(years, 'wheel', this._onwheelyears, 'open');
        this.domEvent.on(months, 'click', function (e) {
          if (e.button) {
            return;
          }

          if (_this4.hasElem(e.target, 'month')) {
            _this4._monthSelector(+e.target.dataset.month, true);
          }
        }, 'open');
        this.domEvent.on(years, 'click', function (e) {
          if (e.button) {
            return;
          }

          var y = e.target.dataset.year;

          if (y) {
            _this4._yearSelector(+y, true);
          }
        }, 'open');
        this.domEvent.on(days, 'mouseover', function (e) {
          var target = e.target,
              d = +target.dataset.day,
              m = +target.dataset.month,
              y = +_this4._currentDate.year;

          if (_this4.hasElem(target, 'day') && _this4.hasMod(target, 'has-title')) {
            _this4.tooltip.show(target, _this4.title.get(ymdToISO(y, m, d)));
          }
        }, 'open');
        this.domEvent.on(days, 'mouseout', function (e) {
          if (_this4.hasElem(e.target, 'day')) {
            _this4.tooltip.hide();
          }
        }, 'open');
        this.domEvent.on(days, 'click', function (e) {
          if (e.button) {
            return;
          }

          var cd = _this4._currentDate,
              target = e.target,
              day = target.dataset.day,
              month = target.dataset.month;

          if (day) {
            if (_this4.hasMod(target, 'minmax')) {
              return;
            }

            if (!_this4.hasMod(target, 'selected')) {
              cd.day = +day;
              cd.month = +month;
              var selected = days.querySelector('.' + _this4.e('day', 'selected'));

              if (selected) {
                _this4.delMod(selected, 'selected');
              }

              _this4.setMod(target, 'selected');

              _this4.trigger('select', {
                day: cd.day,
                month: cd.month,
                year: cd.year
              });

              if (_this4.setting('closeAfterSelection')) {
                _this4.close();
              }
            }
          }
        }, 'open');
      }
    }, {
      key: "_getDeltaY",
      value: function _getDeltaY(e) {
        return e.deltaY >= 1 ? 1 : e.deltaY < 0 ? -1 : 0;
      }
    }, {
      key: "_monthSelector",
      value: function _monthSelector(month, anim) {
        var _this5 = this;

        if (month < MIN_MONTH) {
          month = MIN_MONTH;
        } else if (month > MAX_MONTH) {
          month = MAX_MONTH;
        }

        this._currentDate.month = month;
        var months = this.findElem('months'),
            monthHeight = this.findElem('month').offsetHeight,
            monthsElems = this.findElemAll('days-month'),
            monthElem = monthsElems[month],
            selector = this.findElem('month-selector'),
            daysContainer = this.findElem('days-container'),
            days = this.findElem('days');

        if (!anim) {
          this.setMod(days, 'noanim');
          this.setMod(months, 'noanim');
        }

        var top = Math.floor(this._currentDate.month * monthHeight - monthHeight / 2);

        if (top <= 0) {
          top = 1;
        }

        if (top + selector.offsetHeight >= months.offsetHeight) {
          top = months.offsetHeight - selector.offsetHeight - 1;
        }

        setTranslateY(selector, top);
        var daysContainerTop = -Math.floor(monthElem.offsetTop - days.offsetHeight / 2 + monthElem.offsetHeight / 2);

        if (daysContainerTop > 0) {
          daysContainerTop = 0;
        }

        var deltaHeight = days.offsetHeight - daysContainer.offsetHeight;

        if (daysContainerTop < deltaHeight) {
          daysContainerTop = deltaHeight;
        }

        setTranslateY(daysContainer, daysContainerTop);

        this._colorizeMonths(month);

        if (!anim) {
          this.timeout.set(function () {
            _this5.delMod(days, 'noanim');

            _this5.delMod(months, 'noanim');
          }, 0, 'anim');
        }
      }
    }, {
      key: "_yearSelector",
      value: function _yearSelector(year, anim) {
        var _this6 = this;

        var startYear = this.params.startYear,
            endYear = this.params.endYear,
            oldYear = this._currentDate.year;

        if (year < startYear) {
          year = startYear;
        } else if (year > endYear) {
          year = endYear;
        }

        this._currentDate.year = year;
        var years = this.findElem('years'),
            yearsContainer = this.findElem('years-container'),
            yearHeight = this.findElem('year').offsetHeight,
            selector = this.findElem('year-selector');

        if (!anim) {
          this.setMod(years, 'noanim');
        }

        var topSelector = Math.floor((this._currentDate.year - startYear) * yearHeight);
        var topContainer = -Math.floor((this._currentDate.year - startYear) * yearHeight - years.offsetHeight / 2);

        if (topContainer > 0) {
          topContainer = 0;
        }

        if (topContainer < years.offsetHeight - yearsContainer.offsetHeight) {
          topContainer = years.offsetHeight - yearsContainer.offsetHeight;
        }

        var k = 0;

        if (years.offsetHeight >= yearsContainer.offsetHeight) {
          if ((endYear - startYear + 1) % 2) {
            k = yearHeight;
          }

          topContainer = Math.floor((years.offsetHeight - yearsContainer.offsetHeight - k) / 2);
        }

        if (year !== oldYear) {
          this._rebuildDays(year);
        }

        setTranslateY(selector, topSelector);
        setTranslateY(yearsContainer, topContainer);

        this._colorizeYears(year);

        if (!anim) {
          this.timeout.set(function () {
            _this6.delMod(years, 'noanim');
          }, 0, 'anim');
        }
      }
    }, {
      key: "_decolorize",
      value: function _decolorize(selector) {
        for (var c = 0; c < this.setting('maxColor'); c++) {
          var elems = this.findElemAll(selector, 'color', c);

          for (var i = 0, len = elems.length; i < len; i++) {
            this.delMod(elems[i], 'color', c);
          }
        }
      }
    }, {
      key: "_colorizeMonths",
      value: function _colorizeMonths(month) {
        var months = this.findElemAll('month');

        this._decolorize('month');

        this.setMod(months[month], 'color', '0');

        if (month - 1 >= MIN_MONTH) {
          this.setMod(months[month - 1], 'color', '0');
        }

        if (month + 1 <= MAX_MONTH) {
          this.setMod(months[month + 1], 'color', '0');
        }

        var n = 1;

        for (var c = month - 2; c >= MIN_MONTH && n < this.setting('maxColor'); c--, n++) {
          this.setMod(months[c], 'color', n);
        }

        n = 1;

        for (var _c = month + 2; _c <= MAX_MONTH && n < this.setting('maxColor'); _c++, n++) {
          this.setMod(months[_c], 'color', n);
        }
      }
    }, {
      key: "_colorizeYears",
      value: function _colorizeYears(year) {
        var years = this.findElemAll('year'),
            startYear = this.setting('startYear');

        this._decolorize('year');

        this.setMod(years[year - startYear], 'color', '0');
        var n = 1;

        for (var c = year - 1; c >= startYear && n < this.setting('maxColor'); c--, n++) {
          this.setMod(years[c - startYear], 'color', n);
        }

        n = 1;

        for (var _c2 = year + 1; _c2 <= this.setting('_endYear') && n < this.setting('maxColor'); _c2++, n++) {
          this.setMod(years[_c2 - startYear], 'color', n);
        }
      }
    }, {
      key: "_delOpenedEvents",
      value: function _delOpenedEvents() {
        this.domEvent.offAll('open');
      }
    }, {
      key: "_prepareYears",
      value: function _prepareYears(y) {
        var current = getCurrentDate();
        var buffer, startYear, endYear;

        if (isString(y)) {
          buffer = y.trim().split(/[:,; ]/);
          startYear = parseInt(buffer[0], 10);
          endYear = parseInt(buffer[1], 10);

          if (!isNaN(startYear) && !isNaN(endYear)) {
            if (Math.abs(startYear) < 1000) {
              startYear = current.year + startYear;
            }

            if (Math.abs(endYear) < 1000) {
              endYear = current.year + endYear;
            }
          }
        }

        return {
          start: startYear || current.year - 11,
          end: endYear || current.year + 1
        };
      }
    }, {
      key: "_updateSelection",
      value: function _updateSelection() {
        var daySelected = this.findElem('day', 'selected');

        if (daySelected) {
          this.delMod(daySelected, 'selected');
        }

        if (this._currentDate.year === this._val.year) {
          var months = this.findElemAll('days-month');

          if (months && months[this._val.month]) {
            var elem = this.findElemAllContext(months[this._val.month], 'day'),
                day = this._val.day - 1;

            if (elem && elem[day]) {
              this.setMod(elem[day], 'selected');
            }
          }
        }
      }
    }, {
      key: "_addSwitcherEvents",
      value: function _addSwitcherEvents(showOn) {
        var _this7 = this;

        var switcher = this.setting('switcher'),
            events = Array.isArray(showOn) ? showOn : [showOn || 'click'],
            openedTagNames = ['input', 'textarea'],
            openedEvents = ['focus', 'mouseover'];
        this.domEvent.offAll('switcher');

        if (events.indexOf('none') !== -1) {
          return;
        }

        if (switcher) {
          var tagName = switcher.tagName.toLowerCase();
          events.forEach(function (item) {
            _this7.domEvent.on(switcher, item, function () {
              if (openedTagNames.indexOf(tagName) !== -1 || openedEvents.indexOf(item) !== -1) {
                _this7.open();
              } else {
                _this7.toggle();
              }
            }, 'switcher');
          });
        }
      }
    }, {
      key: "_getSwitcherText",
      value: function _getSwitcherText() {
        var date = this._currentDate,
            m = this.text('months'),
            cm = this.text('caseMonths');
        return date.day + ' ' + (cm || m)[date.month] + ' ' + date.year;
      }
    }, {
      key: "_updateSwitcher",
      value: function _updateSwitcher() {
        var elem = this.setting('switcher'),
            text = this._getSwitcherText();

        if (elem) {
          var tagName = elem.tagName.toLowerCase();

          if (tagName === 'input' || tagName === 'textarea') {
            elem.value = text;
          } else {
            elem.innerHTML = text;
          }
        }
      }
    }], [{
      key: "extend",
      value: function extend(dest, source) {
        for (var i in source) {
          if (source.hasOwnProperty(i)) {
            dest[i] = source[i];
          }
        }

        return dest;
      }
    }]);

    return Calendula;
  }(Block);
  Calendula.version = '0.10.0';

  var locales = {};
  /**
   * Add a locale.
   * @param {string} locale
   * @param {Object} texts
   */

  Calendula.addLocale = function (locale, texts) {
    locales[locale] = texts;
  };
  /**
   * Get locales.
   * @returns {Object[]}
   */


  Calendula.getLocales = function () {
    return Object.keys(locales);
  };
  /**
   * Get text by id for current locale.
   *
   * @param {string} id
   * @returns {*}
   */


  Calendula.prototype.text = function (id) {
    return locales[this.setting('locale')][id];
  };

  var holidays = {};
  /**
   * Add holidays.
   *
   * @param {string} locale
   * @param {Object} data
   */

  Calendula.addHolidays = function (locale, data) {
    holidays[locale] = data;
  };
  /**
   * Get data for holiday by date.
   *
   * @param {number} day
   * @param {number} month
   * @param {number} year
   * @returns {number|undefined}
   */


  Calendula.prototype.getHoliday = function (day, month, year) {
    var locale = this.params.locale;
    return holidays[locale] && holidays[locale][year] ? holidays[locale][year][day + '-' + (month + 1)] : undefined;
  };

  /**
   * Extension: DOM event
   */
  var DomEvent =
  /*#__PURE__*/
  function () {
    function DomEvent() {
      _classCallCheck(this, DomEvent);
    }

    _createClass(DomEvent, [{
      key: "init",
      value: function init() {
        this._buffer = [];
      }
      /**
       * Attach an event handler function for a DOM element.
       *
       * @param {DOMElement} elem
       * @param {string} type
       * @param {Function} callback
       * @param {string} [ns] - Namespace.
       * @returns {DomEvent} this
       */

    }, {
      key: "on",
      value: function on(elem, type, callback, ns) {
        if (elem && type && callback) {
          elem.addEventListener(type, callback, false);

          this._buffer.push({
            elem: elem,
            type: type,
            callback: callback,
            ns: ns
          });
        }

        return this;
      }
      /**
       * Remove an event handler.
       *
       * @param {DOMElement} elem
       * @param {string} type
       * @param {Function} callback
       * @param {string} [ns] - Namespace.
       * @returns {DomEvent} this
       */

    }, {
      key: "off",
      value: function off(elem, type, callback, ns) {
        for (var i = 0; i < this._buffer.length; i++) {
          var item = this._buffer[i];

          if (item && item.elem === elem && item.callback === callback && item.type === type && item.ns === ns) {
            elem.removeEventListener(type, callback, false);

            this._buffer.splice(i, 1);

            i--;
          }
        }

        return this;
      }
      /**
       * Remove all event handler.
       *
       * @param {string} [ns] - Namespace.
       * @returns {DomEvent} this
       */

    }, {
      key: "offAll",
      value: function offAll(ns) {
        for (var i = 0; i < this._buffer.length; i++) {
          var item = this._buffer[i];

          if (ns) {
            if (ns === item.ns) {
              item.elem.removeEventListener(item.type, item.callback, false);

              this._buffer.splice(i, 1);

              i--;
            }
          } else {
            item.elem.removeEventListener(item.type, item.callback, false);
          }
        }

        if (!ns) {
          this._buffer = [];
        }

        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.offAll();
        delete this._buffer;
      }
    }]);

    return DomEvent;
  }();

  /*!
   * jstohtml
   * © 2018 Denis Seleznev
   * License: MIT
   *
   * https://github.com/hcodes/jstohtml/
  */
  var isArray = Array.isArray,
      toString = Object.prototype.toString,
      entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  },
      escapeRE = /[&<>"'/]/g,
      escapeHtml = function (str) {
    return str.replace(escapeRE, function (s) {
      return entityMap[s];
    });
  };

  var Engine = {
    noClosingTag: ['img', 'input', 'br', 'embed', 'source', 'link', 'meta', 'area', 'command', 'base', 'col', 'param', 'wbr', 'hr', 'keygen'],
    ignoredKeys: ['b', // block
    'e', // element
    'm', // modifier
    'c', // content
    't', // tagName
    'cl', // class
    'class' // class
    ],

    /**
     * Is plain object?
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isPlainObj: function (obj) {
      return toString.call(obj) === '[object Object]';
    },

    /**
     * Build a item.
     *
     * @param {*} data
     * @returns {string}
     */
    build: function (data) {
      if (data === null || data === undefined) {
        return '';
      }

      var buf = [];

      if (this.isPlainObj(data)) {
        return this.tag(data);
      } else if (isArray(data)) {
        for (var i = 0, len = data.length; i < len; i++) {
          buf.push(this.build(data[i]));
        }

        return buf.join('');
      } else {
        return '' + data;
      }
    },

    /**
     * Build a tag.
     *
     * @param {*} data
     * @returns {string}
     */
    tag: function (data) {
      var t = data.t || 'div',
          text = '<' + t + this.attrs(data);

      if (this.noClosingTag.indexOf(t) !== -1) {
        return text + '/>';
      }

      text += '>';

      if (data.c) {
        text += this.build(data.c);
      }

      text += '</' + t + '>';
      return text;
    },

    /**
     * Build attrs.
     *
     * @param {Object} data
     * @returns {string}
     */
    attrs: function (data) {
      var b = data.b,
          e = data.e,
          m = data.m,
          buf = [],
          cl = [],
          result,
          key;

      if (b || e) {
        b = b || this._currentBlock;

        if (e) {
          buf.push(this.elem(b, e));
        } else {
          buf.push(this.block(b));
        }

        if (this.isPlainObj(m)) {
          for (key in m) {
            if (m.hasOwnProperty(key)) {
              buf.push(this.elem(b, e, key, m[key]));
            }
          }

          buf.sort();

          for (var i = 0, len = buf.length; i < len; i++) {
            if (buf[i] !== buf[i - 1]) {
              cl.push(buf[i]);
            }
          }
        } else {
          cl = buf;
        }

        result = this.attr('class', cl);
        this._currentBlock = b;
      } else {
        cl = data['cl'] || data['class'];
        result = cl ? this.attr('class', cl) : '';
      }

      for (key in data) {
        if (data.hasOwnProperty(key) && this.ignoredKeys.indexOf(key) === -1) {
          result += this.attr(key, data[key]);
        }
      }

      return result;
    },

    /**
     * Build a attr.
     *
     * @param {string} name
     * @param {*} value
     * @returns {string}
     */
    attr: function (name, value) {
      if (value === undefined || value === null || value === false) {
        return '';
      }

      return ' ' + name + '="' + escapeHtml(isArray(value) ? value.join(' ') : '' + value) + '"';
    },

    /**
     * Build a block.
     *
     * @param {string} block
     * @param {string} [modName]
     * @param {*} [modVal]
     * @returns {string}
     */
    block: function (block, modName, modVal) {
      return block + this.mod(modName, modVal);
    },

    /**
     * Build a elem.
     *
     * @param {string} block
     * @param {string} [elemName]
     * @param {string} [modName]
     * @param {*} [modVal]
     * @returns {string}
     */
    elem: function (block, elemName, modName, modVal) {
      return block + (elemName ? '__' + elemName : '') + this.mod(modName, modVal);
    },

    /**
     * Build a mod.
     *
     * @param {string} modName
     * @param {*} [modVal]
     * @returns {string}
     */
    mod: function (modName, modVal) {
      if (modVal === false || modVal === null || modVal === undefined) {
        return '';
      }

      return '_' + modName + (modVal === '' || modVal === true ? '' : '_' + modVal);
    },

    /**
     * Reset inner properties.
     */
    reset: function () {
      this._currentBlock = '';
      return this;
    }
  };
  /**
   * JS to HTML.
   * 
   * @param {*} data
   * @returns {string}
   */

  function jstohtml(data) {
    return Engine.reset().build(data);
  }

  var Template =
  /*#__PURE__*/
  function () {
    function Template() {
      _classCallCheck(this, Template);
    }

    _createClass(Template, [{
      key: "get",

      /**
       * Get a template.
       *
       * @param {string} name
       * @returns {*}
       */
      value: function get(name) {
        return jstohtml(this[name]());
      }
      /**
       * Template: days
       *
       * @returns {Array}
       */

    }, {
      key: "days",
      value: function days() {
        var buf = [];

        for (var m = MIN_MONTH; m <= MAX_MONTH; m++) {
          buf.push(this.month(m, this.parent._currentDate.year));
        }

        return buf;
      }
      /**
       * Template: dayNames
       *
       * @returns {Object}
       */

    }, {
      key: "dayNames",
      value: function dayNames() {
        var first = this.parent.text('firstWeekday') || 0,
            week = {
          first: first,
          last: !first ? SATURDAY : first - 1
        };
        var day = first;

        for (var i = 0; i < 7; i++) {
          week[day] = i;
          day++;

          if (day > SATURDAY) {
            day = SUNDAY;
          }
        }

        return week;
      }
      /**
       * Template: month
       *
       * @param {number} m - Month.
       * @param {number} y - Year.
       * @returns {Array}
       */

    }, {
      key: "month",
      value: function month(m, y) {
        var date = new Date(y, m, 1, 12, 0, 0, 0),
            parent = this.parent,
            data = {
          weekday: date.getDay(),
          min: parent.setting('min'),
          max: parent.setting('max'),
          dayNames: this.dayNames()
        },
            minTs = this._getTs(data.min),
            maxTs = this._getTs(data.max),
            todayTs = this._todayAt12();

        var row = this._monthFirstRow(data, m, y);

        var result = this._daysMonth(data, m, y, row);

        for (var day = 1; date.getMonth() === m; date.setDate(++day)) {
          var title = '';
          var dateTs = +date,
              mods = {},
              weekday = date.getDay(),
              holiday = parent.getHoliday(day, m, y);

          if (weekday === SUNDAY || weekday === SATURDAY) {
            mods.holiday = true;
          } else {
            mods.workday = true;
          }

          if (holiday === 0) {
            mods.nonholiday = true;
          } else if (holiday === 1) {
            mods.highday = true;
          }

          if (this._isSelected(parent._val, day, m, y)) {
            mods.selected = true;
          }

          if (todayTs === dateTs) {
            mods.now = true;
            title = parent.text('today');
          }

          if (minTs && dateTs < minTs || maxTs && dateTs > maxTs) {
            mods.minmax = true;
          }

          var tt = parent.title.get(ymdToISO(y, m, day));

          if (tt) {
            mods['has-title'] = true;
            mods['title-color'] = tt.color || 'default';
          }

          if (weekday === data.dayNames.first) {
            row = {
              t: 'tr',
              c: []
            };
            result.c[1].c.push(row);
          }

          row.c.push({
            t: 'td',
            e: 'day',
            m: mods,
            title: title,
            'data-month': m,
            'data-day': day,
            c: day
          });
        }

        return result;
      }
    }, {
      key: "_todayAt12",
      value: function _todayAt12() {
        var current = new Date();
        current.setHours(12, 0, 0, 0);
        return current.getTime();
      }
    }, {
      key: "_monthFirstRow",
      value: function _monthFirstRow(data, m, y) {
        var dayIndex = data.dayNames[data.weekday];
        return {
          t: 'tr',
          c: [data.weekday !== data.dayNames.first ? {
            t: 'td',
            colspan: dayIndex,
            e: 'empty',
            c: dayIndex < 3 ? '' : this._getTitleMonth(data.min, data.max, m, y)
          } : '']
        };
      }
    }, {
      key: "_daysMonth",
      value: function _daysMonth(data, m, y, content) {
        var dayIndex = data.dayNames[data.weekday];
        return {
          b: this.parent._name,
          e: 'days-month',
          c: [dayIndex < 3 ? this._getTitleMonth(data.min, data.max, m, y) : '', {
            t: 'table',
            e: 'days-table',
            c: [content]
          }]
        };
      }
      /**
       * Template: years
       *
       * @returns {Array}
       */

    }, {
      key: "years",
      value: function years() {
        var params = this.parent.params,
            buf = [{
          b: this.parent._name,
          e: 'year-selector',
          c: {
            e: 'year-selector-i'
          }
        }];

        for (var i = params.startYear; i <= params.endYear; i++) {
          buf.push({
            b: this.parent._name,
            e: 'year',
            'data-year': i,
            c: i
          });
        }

        return buf;
      }
      /**
       * Template: months
       *
       * @returns {Array}
       */

    }, {
      key: "months",
      value: function months() {
        var _this = this;

        var buf = [{
          b: this.parent._name,
          e: 'month-selector',
          c: {
            e: 'month-selector-i'
          }
        }];
        this.parent.text('months').forEach(function (el, i) {
          buf.push({
            b: _this.parent._name,
            e: 'month',
            'data-month': i,
            c: el
          });
        });
        return buf;
      }
      /**
       * Template: main
       *
       * @returns {Array}
       */

    }, {
      key: "main",
      value: function main() {
        var parent = this.parent,
            dayNames = parent.text('dayNames') || [],
            bufDayNames = [];
        var weekday = parent.text('firstWeekday') || SUNDAY;
        parent.text('shortDayNames').forEach(function (el, i, data) {
          bufDayNames.push({
            e: 'short-daynames-cell',
            m: {
              n: weekday
            },
            title: dayNames[weekday] || data[weekday],
            c: data[weekday]
          });
          weekday++;

          if (weekday > SATURDAY) {
            weekday = SUNDAY;
          }
        }, this);
        return [{
          b: this.parent._name,
          e: 'container',
          c: [{
            e: 'days-i',
            c: [{
              b: this.parent._name,
              e: 'short-daynames',
              c: bufDayNames
            }, {
              e: 'days',
              c: {
                e: 'days-container',
                c: this.days()
              }
            }]
          }, {
            e: 'months',
            c: this.months()
          }, {
            e: 'years',
            c: {
              e: 'years-container',
              c: this.years()
            }
          }]
        }];
      }
    }, {
      key: "_isSelected",
      value: function _isSelected(val, d, m, y) {
        return d === val.day && m === val.month && y === val.year;
      }
    }, {
      key: "_getTitleMonth",
      value: function _getTitleMonth(min, max, m, y) {
        function getValue(setting) {
          return parseInt('' + setting.year + leadZero(setting.month), 10);
        }

        var minValue = getValue(min),
            maxValue = getValue(max),
            mods = {},
            cur = parseInt('' + y + leadZero(m), 10);

        if (minValue && cur < minValue || maxValue && cur > maxValue) {
          mods.minmax = true;
        }

        return {
          e: 'days-title-month',
          m: mods,
          c: this.parent.text('months')[m]
        };
      }
    }, {
      key: "_getTs",
      value: function _getTs(d) {
        return d.year ? new Date(d.year, d.month, d.day, 12, 0, 0, 0).getTime() : null;
      }
    }]);

    return Template;
  }();

  /**
   * Extension: Timeout
   */
  var Timeout =
  /*#__PURE__*/
  function () {
    function Timeout() {
      _classCallCheck(this, Timeout);
    }

    _createClass(Timeout, [{
      key: "init",
      value: function init() {
        this._buffer = [];
      }
      /**
       * Set timeout.
       *
       * @param {Function} callback
       * @param {number} time
       * @param {string} [ns] - Namespace.
       * @returns {Timeout} this
       */

    }, {
      key: "set",
      value: function set(callback, time, ns) {
        var _this = this;

        var id = setTimeout(function () {
          callback();

          _this.clear(id);
        }, time);

        this._buffer.push({
          id: id,
          ns: ns
        });

        return id;
      }
      /**
       * Clear timeout.
       *
       * @param {string} id
       * @returns {Timeout} this
       */

    }, {
      key: "clear",
      value: function clear(id) {
        var index = -1;

        if (this._buffer) {
          this._buffer.some(function (item, i) {
            if (item.id === id) {
              index = i;
              return true;
            }

            return false;
          });

          if (index >= 0) {
            clearTimeout(this._buffer[index].id);

            this._buffer.splice(index, 1);
          }
        }

        return this;
      }
      /**
       * Clear all timeouts.
       *
       * @param {string} [ns] - Namespace.
       * @returns {Timeout} this
       */

    }, {
      key: "clearAll",
      value: function clearAll(ns) {
        var oldBuffer = this._buffer,
            newBuffer = [],
            nsArray = Array.isArray(ns) ? ns : [ns];
        oldBuffer.forEach(function (item) {
          if (ns) {
            if (nsArray.indexOf(item.ns) !== -1) {
              clearTimeout(item.id);
            } else {
              newBuffer.push(item);
            }
          } else {
            clearTimeout(item.id);
          }
        });
        this._buffer = ns ? newBuffer : [];
        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.clearAll();
        delete this._buffer;
      }
    }]);

    return Timeout;
  }();

  var Title =
  /*#__PURE__*/
  function () {
    function Title() {
      _classCallCheck(this, Title);
    }

    _createClass(Title, [{
      key: "init",
      value: function init(data) {
        this._title = {};
        this.set(data.title);
      }
      /**
       * Get title by date.
       *
       * @param {Date|number|string} date
       * @returns {?Object}
       */

    }, {
      key: "get",
      value: function get(date) {
        var iso = parseDateToISO(date);
        return iso ? this._title[iso] : null;
      }
      /**
       * Set title by date.
       *
       * @param {Object|Array} data
       */

    }, {
      key: "set",
      value: function set(data) {
        var _this = this;

        if (Array.isArray(data)) {
          data.forEach(function (item) {
            return _this._set(item);
          });
        } else if (isPlainObj(data)) {
          this._set(data);
        }
      }
    }, {
      key: "_set",
      value: function _set(data) {
        var iso = parseDateToISO(data.date),
            parent = this.parent;

        if (iso) {
          this._title[iso] = {
            text: data.text,
            color: data.color
          };

          if (parent._isInited) {
            var day = parent._findDayByDate(parseDateToObj(data.date));

            day && parent.setMod(day, 'has-title').setMod(day, 'title-color', data.color);
          }
        }
      }
      /**
       * Remove title.
       *
       * @param {Date|number|string} date
       */

    }, {
      key: "remove",
      value: function remove(date) {
        var _this2 = this;

        if (Array.isArray(date)) {
          date.forEach(function (item) {
            return _this2._remove(item);
          });
        } else {
          this._remove(date);
        }
      }
    }, {
      key: "_remove",
      value: function _remove(date) {
        var parent = this.parent,
            iso = parseDateToISO(date);

        if (iso) {
          delete this._title[iso];

          if (parent._isInited) {
            var day = parent._findDayByDate(parseDateToObj(date));

            if (day) {
              parent.delMod(day, 'has-title').delMod(day, 'title-color');
            }
          }
        }
      }
      /**
       * Remove all titles.
       */

    }, {
      key: "removeAll",
      value: function removeAll() {
        var parent = this.parent;
        this._title = {};

        if (parent._isInited) {
          var days = parent.findElemAll('day', 'has-title');

          if (days) {
            for (var i = 0; i < days.length; i++) {
              parent.delMod(days[i], 'has-title').delMod(days[i], 'title-color');
            }
          }
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        delete this._title;
      }
    }]);

    return Title;
  }();

  var Tooltip =
  /*#__PURE__*/
  function () {
    function Tooltip() {
      _classCallCheck(this, Tooltip);
    }

    _createClass(Tooltip, [{
      key: "show",

      /**
       * Show tooltip.
       * @param {DOMElement} target
       * @param {Object} data
       * @param {string} data.text
       * @param {string} data.color
       */
      value: function show(target, data) {
        this._create();

        data = data || {};
        var parent = this.parent,
            margin = 5,
            dom = this._dom;
        parent.setMod(dom, 'theme', parent.setting('theme')).setMod(dom, 'visible').setMod(dom, 'color', data.color || 'default');
        parent.findElemContext(dom, 'tooltip-text').innerHTML = jstohtml({
          b: this.parent._name,
          e: 'tooltip-row',
          c: data.text
        });
        var offset = getOffset(target);
        setPosition(dom, {
          left: offset.left - (dom.offsetWidth - target.offsetWidth) / 2,
          top: offset.top - dom.offsetHeight - margin
        });
        this._isOpened = true;
      }
      /**
       * Hide tooltip.
       */

    }, {
      key: "hide",
      value: function hide() {
        if (this._isOpened) {
          this.parent.delMod(this._dom, 'visible');
          this._isOpened = false;
        }
      }
    }, {
      key: "_create",
      value: function _create() {
        if (this._dom) {
          return;
        }

        var elem = document.createElement('div'),
            parent = this.parent,
            b = parent._name;
        elem.classList.add(parent.e('tooltip'));
        elem.innerHTML = jstohtml([{
          b: b,
          e: 'tooltip-text'
        }, {
          b: b,
          e: 'tooltip-tail'
        }]);
        document.body.appendChild(elem);
        this._dom = elem;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._dom) {
          this.hide();
          document.body.removeChild(this._dom);
          delete this._dom;
        }
      }
    }]);

    return Tooltip;
  }();

  var extensions = [];

  function getExtensionName(ext) {
    return ext.name[0].toLowerCase() + ext.name.substr(1);
  }

  Calendula.extend(Calendula.prototype, {
    _initExtensions: function _initExtensions() {
      var _this = this;

      extensions.forEach(function (Extension) {
        var obj = new Extension();
        obj.parent = _this;
        _this[getExtensionName(Extension)] = obj;

        if (obj.init) {
          obj.init(_this.params, _this._dom);
        }
      });
    },
    _destroyExtensions: function _destroyExtensions() {
      var _this2 = this;

      extensions.forEach(function (ext) {
        var name = getExtensionName(ext);
        _this2[name].destroy && _this2[name].destroy();
        delete _this2[name];
      }, this);
    }
  });

  Calendula.addExtension = function (klass) {
    if (Array.isArray(klass)) {
      extensions = extensions.concat(klass);
    } else {
      extensions.push(klass);
    }
  };

  Calendula.addExtension([DomEvent, Template, Timeout, Title, Tooltip]);

  return Calendula;

}));
