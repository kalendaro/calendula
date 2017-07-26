/*! Calendula | © 2017 Denis Seleznev | https://github.com/hcodes/calendula/ */
!function(t,e,n,i,o){!function(t,e){"function"==typeof define&&define.amd?define("calendula",[],e):"object"==typeof exports?module.exports=e():t.Calendula=e()}(this,function(){"use strict";/**
     * Add a leading zero.
     * @param {number} value
     * @return {string}
     */
function a(t){return(t<10?"0":"")+t}/**
     * Convert a date to ISO format.
     * @param {number} year
     * @param {number} month - 0-11
     * @param {number} day
     * @return {string}
     */
function r(t,e,n){return[t,a(e+1),a(n)].join("-")}/**
     * Parse a date.
     * @param {string|number|Date} value
     * @return {Date}
     */
function s(t){var e,i,o=null;if(t)if(g(t)){if("today"===t)return new n;(e=/^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(t))?i=[e[3],e[2],e[1]]:(e=/^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(t))&&(i=[e[1],e[2],e[3]]),i&&(o=new n(p(i[2]),p(i[1]-1),p(i[0])))}else x(t)?t instanceof n?o=t:t.year&&t.day&&(o=new n(t.year,t.month,t.day,12,0,0,0)):b(t)&&(o=new n(t));return o}/**
     * Parse a date and convert to ISO format.
     * @param {string|number|Date} value
     * @return {string|null}
     */
function l(t){var e=s(t);return e?[e.getFullYear(),a(e.getMonth()+1),a(e.getDate())].join("-"):null}/**
     * Convert a date to a object.
     * @param {string|number|Date} value
     * @return {Object}
     */
function c(t){var e=s(t);return e?{day:e.getDate(),month:e.getMonth(),year:e.getFullYear()}:{}}/**
     * Build CSS class for bem-element.
     * @param {string} name - Bem-element name.
     * @param {string} [m] - Mod name.
     * @param {string} [val] - Mod value.
     * @return {string}
     */
function h(t,e,n){return null===n||!1===n?e="":!0!==n&&n!==o||(n=""),C+"__"+t+(e?"_"+e+(""===n?"":"_"+n):"")}/**
     * Build CSS class for bem-mod.
     * @param {string} name - Mod name.
     * @param {string} [val] - Mod value.
     * @return {string}
     */
function u(t,e){return null===e||!1===e?t="":!0!==e&&e!==o||(e=""),C+(t?"_"+t+(""===e?"":"_"+e):"")}/**
     * Remove bem-mod from DOM element.
     * @param {DOMElement} el
     * @param {string} m - Mod name.
     */
function d(t,e){var n=y(t),i=n?h(n,e):u(e);(t.className||"").split(" ").forEach(function(e){e!==i&&-1===e.search(i+"_")||H(t,e)})}/**
     * Set bem-mod for DOM element.
     * @param {DOMElement} el
     * @param {string} m - Mod name.
     * @param {string} [val] - Mod value.
     */
function f(t,e,n){var i=y(t);d(t,e),k(t,i?h(i,e,n):u(e,n))}/**
     * Has bem-mod for DOM element?
     * @param {DOMElement} el
     * @param {string} m - Mod name.
     * @param {string} [val] - Mod value.
     */
function _(t,e,n){var i=y(t);return T(t,i?h(i,e,n):u(e,n))}/**
     * Has bem-element?
     * @param {DOMElement} el
     * @param {string} e - Element name.
     * @return {boolean}
     */
function m(t,e){return T(t,h(e))}/**
     * Get bem-element name.
     * @param {DOMElement} el
     * @return {string}
     */
function y(t){var e=t.className.match(/__([^ _$]+)/);return e?e[1]:""}/**
     * Parse a number, fix for native parseInt.
     * @param {string} str
     * @return {number}
     */
function p(t){return parseInt(t,10)}/**
     * Is plain object?
     * @param {*} obj
     * @return {boolean}
     */
function v(t){return"[object Object]"===Object.prototype.toString.call(t)}/**
     * Is a string?
     * @param {*} obj
     * @return {boolean}
     */
function g(t){return"string"==typeof t}/**
     * Is a number?
     * @param {*} obj
     * @return {boolean}
     */
function b(t){return"number"==typeof t}/**
     * Is a object?
     * @param {*} obj
     * @return {boolean}
     */
function x(t){return"object"==typeof t}/**
     * Is a undefined?
     * @param {*} obj
     * @return {boolean}
     */
function D(t){return void 0===t}/*
     * Get offset of element.
     * @param {DOMElement} el
     * @return {Object}
     */
function A(n){var i={top:0,left:0};
// If we don't have gBCR, just use 0,0 rather than error
// BlackBerry 5, iOS 3 (original iPhone)
return n&&!D(n.getBoundingClientRect)&&(i=n.getBoundingClientRect()),{top:i.top+(t.pageYOffset||e.scrollTop||0)-(e.clientTop||0),left:i.left+(t.pageXOffset||e.scrollLeft||0)-(e.clientLeft||0)}}/*
     * Set position of element.
     * @param {DOMElement} el
     * @param {Object} coords
     * @param {string|number} coords.left
     * @param {string|number} coords.top
     */
function M(t,e){S(t,e.left),N(t,e.top)}/*
     * Set left for a DOM element.
     * @param {DOMElement} el
     * @param {string|number} left
     */
function S(t,e){t.style.left=b(e)?e+"px":e}/*
     * Set top for a DOM element.
     * @param {DOMElement} el
     * @param {string|number} top
     */
function N(t,e){t.style.top=b(e)?e+"px":e}var w=e.createElement("div"),/**
         * Get a data attribute.
         * @param {DOMElement} el
         * @param {string} name
         * @return {string|undefined}
         */
E=w.dataset?function(t,e){return t.dataset[e]}:function(t,e){// support IE9
return t.getAttribute("data-"+e)},O=!!w.classList,/**
         * Add a CSS class.
         * @param {DOMElement} el
         * @param {string} name
         */
k=O?function(t,e){t.classList.add(e)}:function(t,e){new RegExp("(^|\\s)"+e+"(\\s|$)","g").test(e.className)||(t.className=(t.className+" "+e).replace(/\s+/g," ").replace(/(^ | $)/g,""))},/**
         * Remove a CSS class.
         * @param {DOMElement} el
         * @param {string} name
         */
H=O?function(t,e){t.classList.remove(e)}:function(t,e){// support IE9
var n=new RegExp("(^|\\s)"+e+"(\\s|$)","g");t.className=t.className.replace(n,"$1").replace(/\s+/g," ").replace(/(^ | $)/g,"")},/**
         * Has CSS class.
         * @param {DOMElement} el
         * @param {string} name
         */
T=O?function(t,e){return t.classList.contains(e)}:function(t,e){// support IE9
var n=new RegExp("(^|\\s)"+e+"(\\s|$)","g");return-1!==t.className.search(n)},C="calendula",L=function(){function t(n){if(null===n||n===o)return"";var i=[];if(v(n))return e(n);if(Array.isArray(n)){for(var a=0,r=n.length;a<r;a++)i.push(t(n[a]));return i.join("")}return""+n}function e(e){var i=e.t||"div",o="<"+i+n(e)+">";return e.c&&(o+=t(e.c)),o+="</"+i+">"}function n(t){var e,n,o=Object.keys(t),a=["c","t","e","m"],// content, tag, element, modifier
r=[],s=[],l="";if(t.e&&s.push(h(t.e)),t.m)if(t.e)for(e in t.m)t.m.hasOwnProperty(e)&&s.push(h(t.e,e,t.m[e]));else for(e in t.m)t.m.hasOwnProperty(e)&&s.push(u(e,t.m[e]));for(s.length&&r.push(i("class",s)),e=0,n=o.length;e<n;e++){var c=o[e];-1===a.indexOf(c)&&r.push(i(c,t[c]))}return(l=r.join(" "))?" "+l:""}function i(t,e){return null!==e&&e!==o?t+'="'+(Array.isArray(e)?e.join(" "):e)+'"':""}return t}(),z={ESC:27,PAGE_DOWN:34,PAGE_UP:33,CURSOR_UP:38,CURSOR_DOWN:40,CURSOR_LEFT:37,CURSOR_RIGHT:39},Y=function(){var t=e.createElement("div"),n=!1;return["Moz","Webkit","O","ms",""].forEach(function(e){var i=e+(e?"T":"t")+"ransform";i in t.style&&(n=i)}),!1===n?function(t,e){t.style.top=b(e)?e+"px":e}:function(t,e){t.style[n]="translateY("+(b(e)?e+"px":e)+")"}}(),W=function(t){t=W.extend({},t||{});var e=this._prepareYears(t.years),n=W.extend(t,{autocloseable:!!D(t.autocloseable)||t.autocloseable,closeAfterSelection:!!D(t.closeAfterSelection)||t.closeAfterSelection,locale:t.locale||W._defaultLocale,max:c(t.max),min:c(t.min),showOn:t.showOn||"click",theme:t.theme||"default",_startYear:e.start,_endYear:e.end});this._data=n,this._initExtensions(),this.val(n.value),this._addSwitcherEvents(n.showOn)};/**
     * Extend a object.
     * @param {Object} dest
     * @param {Object} source
     * @return {Object}
     */
W.extend=function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},W.MIN_MONTH=0,W.MAX_MONTH=11,W.extend(W.prototype,{/*
         * Is opened popup?
         * @return {boolean}
        */
isOpened:function(){return this._isOpened},/*
         * Open popup.
         * @return {Calendula} this
        */
open:function(){var t=this;return this._init(),this.isOpened()||(this.timeout.clearAll(["open","close"]).set(function(){f(t._container,"opened"),t._update(),t._monthSelector(t._currentDate.month,!1),t._yearSelector(t._currentDate.year,!1),t._openedEvents()},0,"open"),this._isOpened=!0,this.event.trigger("open")),this},/*
         * Close popup.
         * @return {Calendula} this
        */
close:function(){var t=this;return this._init(),this.isOpened()&&(this.timeout.clearAll(["open","close"]).set(function(){t.timeout.clearAll("open"),t._update(),t._delOpenedEvents(),d(t._container,"opened"),t.tooltip.hide(),t.event.trigger("close")},0,"close"),this._isOpened=!1),this},/*
         * Open/close popup.
         * @return {Calendula} this
        */
toggle:function(){return this.isOpened()?this.close():this.open()},/*
         * Get/set value.
         * @param {string|number|Date} [value]
         * @return {*}
        */
val:function(t){if(!arguments.length)return this._val;t?(this._val=c(t),this._currentDate=W.extend({},this._val)):(this._val={},this._currentDate=this._current()),this._container&&this._updateSelection(),this._updateSwitcher()},/*
         * Get/set a setting.
         *
         * @param {string} name
         * @param {string} [value]
         * @return {*}
        */
setting:function(t,e){var n=this._data,i=this._container,o={min:!0,max:!0,locale:!0};return 1===arguments.length?n[t]:(n[t]=["min","max","value"].indexOf(t)>-1?c(e):e,"showOn"===t&&this._addSwitcherEvents(e),i&&("theme"===t?f(i,"theme",e):"daysAfterMonths"===t&&(e?f(i,"days-after-months"):d(i,"days-after-months")),"position"===t&&this.isOpened()&&this._position(e),o[t]&&this._rebuild()),this)},/*
         * Destroy the datepicker.
        */
destroy:function(){this._isInited&&(this.close(),this._removeExtensions(),e.body.removeChild(this._container),this._data=null,this._container=null,this._isInited=null)},_init:function(){if(!this._isInited){this._isInited=!0;var t=this.setting("id"),n=e.createElement("div");t&&(n.id=t),this._container=n,k(n,C),f(n,"theme",this._data.theme),this.setting("daysAfterMonths")&&f(n,"days-after-months"),this._rebuild(),e.body.appendChild(n)}},_isAuto:function(t){return"auto"===t||D(t)},_position:function(t){t=(t||"").split(" ");var e=this.setting("switcher"),n=t[0],i=t[1];if(e&&(this._isAuto(n)||this._isAuto(i))){var o=this._calcBestPosition(n,i,e);n=o.left,i=o.top}M(this._container,this._calcPosition(n,i,e))},_calcPosition:function(t,e,n){var i,o,a=A(n),r=this._container,s=r.offsetWidth,l=r.offsetHeight,c=a.left,h=a.top;if(g(t))switch(t){case"left":i=c;break;case"center":i=c+(n.offsetWidth-s)/2;break;case"right":i=c+n.offsetWidth-s}if(g(e))switch(e){case"top":o=h-l;break;case"center":o=h-(l-n.offsetHeight)/2;break;case"bottom":o=h+n.offsetHeight}return{left:i,top:o}},_calcVisibleSquare:function(t,e,n){var o={x1:t,y1:e,x2:t+this._container.offsetWidth,y2:e+this._container.offsetHeight},a=function(t,e,n,o){return e<=n||t>=o?0:i.min(e,o)-i.max(t,n)};return a(o.x1,o.x2,n.x1,n.x2)*a(o.y1,o.y2,n.y1,n.y2)},_calcBestPosition:function(t,e,n){var i=-1,o=0,a=this._winArea(),r=this._isAuto(t),s=this._isAuto(e);this._bestPositions.forEach(function(l,c){var h,u,d=l[0],f=l[1];(r&&s||r&&e===f||s&&t===d)&&(h=this._calcPosition(d,f,n),(u=this._calcVisibleSquare(h.left,h.top,a))>i&&(i=u,o=c))},this);var l=this._bestPositions[o];return{left:l[0],top:l[1]}},_bestPositions:[["left","bottom"],["left","top"],["right","bottom"],["right","top"],["center","bottom"],["center","top"]],_winArea:function(){var n=e.documentElement,i=t.pageXOffset,o=t.pageYOffset;return{x1:i,y1:o,x2:i+n.clientWidth,y2:o+n.clientHeight}},_current:function(){var t=new n;return{day:t.getDate(),month:t.getMonth(),year:t.getFullYear()}},_update:function(){this._init(),this._position(this.setting("position"))},_findDayByDate:function(t){if(t.year!==this._currentDate.year)return null;var e=this._elemAll("days-month")[t.month];return e?this._elemAllContext(e,"day")[t.day-1]||null:null},_onresize:function(){this._update()},_onscroll:function(){this._update()},_rebuild:function(){var t=this.isOpened();t&&this._delOpenedEvents(),this._container.innerHTML=this.template.get("main"),t&&(this._openedEvents(),this._monthSelector(this._currentDate.month,!1),this._yearSelector(this._currentDate.year,!1))},_rebuildDays:function(){this._elem("days-container").innerHTML=this.template.get("days"),this._monthSelector(this._currentDate.month,!1)},_intoContainer:function(t){for(var e=t;e;){if(e===this._container)return!0;e=e.parentNode}return!1},_openedEvents:function(){var n=this;this.domEvent.on(e,"click",function(t){!t.button&&n.setting("autocloseable")&&(t.target===n.setting("switcher")||n._intoContainer(t.target)||n.close())},"open"),this.domEvent.on(t,"resize",function(){n._onresize()},"open").on(e,"scroll",function(){n._onscroll()},"open").on(e,"keypress",function(t){var e=n._currentDate;switch(t.keyCode){case z.ESC:n.close();break;case z.PAGE_DOWN:t.ctrlKey||t.altKey?n._monthSelector(e.month+1,!0):n._yearSelector(e.year+1,!0),t.preventDefault();break;case z.PAGE_UP:t.ctrlKey||t.altKey?n._monthSelector(e.month-1,!0):n._yearSelector(e.year-1,!0),t.preventDefault()}},"open").on(this._container,"click",function(t){t.button||n.tooltip.hide()},"open");var i=this._elem("days"),o=this._elem("months"),a=this._elem("years"),s=function(t){var e=0;return t.deltaY>0?e=1:t.deltaY<0&&(e=-1),e};this._onwheelmonths=function(t){var e=s(t);e&&(n._monthSelector(n._currentDate.month+e,!0),t.preventDefault())},this._onwheelyears=function(t){var e=s(t);e&&(n._yearSelector(n._currentDate.year+e,!0),t.preventDefault())},this.domEvent.onWheel(i,this._onwheelmonths,"open").onWheel(o,this._onwheelmonths,"open").onWheel(a,this._onwheelyears,"open"),this.domEvent.on(o,"click",function(t){t.button||m(t.target,"month")&&n._monthSelector(+E(t.target,"month"),!0)},"open"),this.domEvent.on(a,"click",function(t){if(!t.button){var e=E(t.target,"year");e&&n._yearSelector(+e,!0)}},"open"),this.domEvent.on(i,"mouseover",function(t){var e=t.target,i=+E(e,"day"),o=+E(e,"month"),a=+n._currentDate.year;m(e,"day")&&_(e,"has-title")&&n.tooltip.show(e,n.title.get(r(a,o,i)))},"open"),this.domEvent.on(i,"mouseout",function(t){m(t.target,"day")&&n.tooltip.hide()},"open"),this.domEvent.on(i,"click",function(t){if(!t.button){var e=n._currentDate,o=t.target,a=E(o,"day"),r=E(o,"month");if(a){if(_(o,"minmax"))return;if(!_(o,"selected")){e.day=+a,e.month=+r;var s=i.querySelector("."+h("day","selected"));s&&d(s,"selected"),f(o,"selected"),n.event.trigger("select",{day:e.day,month:e.month,year:e.year}),n.setting("closeAfterSelection")&&n.close()}}}},"open")},_monthSelector:function(t,e){t<W.MIN_MONTH?t=W.MIN_MONTH:t>W.MAX_MONTH&&(t=W.MAX_MONTH),this._currentDate.month=t;var n,o=this._elem("months"),a=this._elem("month").offsetHeight,r=this._elemAll("days-month")[t],s=this._elem("month-selector"),l=this._elem("days-container"),c=this._elem("days");e||(f(c,"noanim"),f(o,"noanim"));var h=i.floor(this._currentDate.month*a-a/2);h<=0&&(h=1),h+s.offsetHeight>=o.offsetHeight&&(h=o.offsetHeight-s.offsetHeight-1),Y(s,h),(n=-i.floor(r.offsetTop-c.offsetHeight/2+r.offsetHeight/2))>0&&(n=0);var u=c.offsetHeight-l.offsetHeight;n<u&&(n=u),Y(l,n),this._colorizeMonths(t),e||this.timeout.set(function(){d(c,"noanim"),d(o,"noanim")},0,"anim")},_yearSelector:function(t,e){var n=this._data,o=n._startYear,a=n._endYear,r=this._currentDate.year;t<o?t=o:t>a&&(t=a),this._currentDate.year=t;var s=this._elem("years"),l=this._elem("years-container"),c=this._elem("year").offsetHeight,h=this._elem("year-selector");e||f(s,"noanim");var u=i.floor((this._currentDate.year-o)*c),_=-i.floor((this._currentDate.year-o)*c-s.offsetHeight/2);_>0&&(_=0),_<s.offsetHeight-l.offsetHeight&&(_=s.offsetHeight-l.offsetHeight);var m=0;s.offsetHeight>=l.offsetHeight&&((a-o+1)%2&&(m=c),_=i.floor((s.offsetHeight-l.offsetHeight-m)/2)),t!==r&&this._rebuildDays(t),Y(h,u),Y(l,_),this._colorizeYears(t),e||this.timeout.set(function(){d(s,"noanim")},0,"anim")},_maxColor:5,_decolorize:function(t){for(var e=0;e<this._maxColor;e++)for(var n=this._elemAll(t,"color",e),i=0,o=n.length;i<o;i++)d(n[i],"color",e)},_colorizeMonths:function(t){var e=this._elemAll("month");this._decolorize("month"),f(e[t],"color","0"),t-1>=W.MIN_MONTH&&f(e[t-1],"color","0"),t+1<=W.MAX_MONTH&&f(e[t+1],"color","0");for(var n=1,i=t-2;i>=W.MIN_MONTH&&n<this._maxColor;i--,n++)f(e[i],"color",n);for(n=1,i=t+2;i<=W.MAX_MONTH&&n<this._maxColor;i++,n++)f(e[i],"color",n)},_colorizeYears:function(t){var e=this._elemAll("year"),n=this._data._startYear;this._decolorize("year"),f(e[t-n],"color","0");for(var i=1,o=t-1;o>=n&&i<this._maxColor;o--,i++)f(e[o-n],"color",i);for(i=1,o=t+1;o<=this._data._endYear&&i<this._maxColor;o++,i++)f(e[o-n],"color",i)},_delOpenedEvents:function(){this.domEvent.offAll("open")},_prepareYears:function(t){var e,n,o,a=this._current();return g(t)&&(n=p((e=t.trim().split(/[:,; ]/))[0]),o=p(e[1]),isNaN(n)||isNaN(o)||(i.abs(n)<1e3&&(n=a.year+n),i.abs(o)<1e3&&(o=a.year+o))),{start:n||a.year-11,end:o||a.year+1}},_updateSelection:function(){var t=this._elem("day","selected");if(t&&d(t,"selected"),this._currentDate.year===this._val.year){var e=this._elemAll("days-month");if(e&&e[this._val.month]){var n=this._elemAllContext(e[this._val.month],"day"),i=this._val.day-1;n&&n[i]&&f(n[i],"selected")}}},_addSwitcherEvents:function(t){var e=this.setting("switcher"),n=this,i=Array.isArray(t)?t:[t||"click"],o=["input","textarea"],a=["focus","mouseover"];if(this.domEvent.offAll("switcher"),-1===i.indexOf("none")&&e){var r=e.tagName.toLowerCase();i.forEach(function(t){n.domEvent.on(e,t,function(){-1!==o.indexOf(r)||-1!==a.indexOf(t)?n.open():n.toggle()},"switcher")})}},_switcherText:function(){var t=this._currentDate,e=this.text("months"),n=this.text("caseMonths");return t.day+" "+(n||e)[t.month]+" "+t.year},_updateSwitcher:function(){var t,e=this.setting("switcher"),n=this._switcherText();e&&("input"===(t=e.tagName.toLowerCase())||"textarea"===t?e.value=n:e.innerHTML=n)},_elem:function(t,e,n){return this._container.querySelector("."+h(t,e,n))},_elemAll:function(t,e,n){return this._container.querySelectorAll("."+h(t,e,n))},_elemAllContext:function(t,e,n,i){return t.querySelectorAll("."+h(e,n,i))}}),W.version="0.9.11",W.extend(W.prototype,{_initExtensions:function(){W._exts.forEach(function(t){var e=t[0],n=t[1]||function(){},i=t[2];W.extend(n.prototype,i),this[e]=new n;var o=this[e];o.parent=this,o.init&&o.init(this._data,this._container)},this)},_removeExtensions:function(){W._exts.forEach(function(t){var e=t[0];this[e].destroy(),delete this[e]},this)}}),W._exts=[],W.addExtension=function(t,e,n){W._exts.push([t,e,n])};var P="onwheel"in e.createElement("div")?"wheel":// Modern browsers support "wheel"
e.onmousewheel!==o?"mousewheel":// Webkit and IE support at least "mousewheel"
"DOMMouseScroll";// let's assume that remaining browsers are older Firefox
/*
     * Extension: DOM event
    */
/*
     * Extension: Event
    */
/**
     * Get data for holiday by date.
     * @param {number} day
     * @param {number} month
     * @param {number} year
     * @return {number|undefined}
     */
/**
     * Get text by id for current locale.
     * @param {string} id
     * @return {*}
     */
/*
     * Extension: Template
    */
/*
     * Extension: Timeout
    */
/*
     * Extension: Title
    */
/*
     * Extension: Tooltip
    */
return W.addExtension("domEvent",function(){this._buf=[]},{/*
         * Attach an wheel event handler function for a DOM element.
         * @param {DOMElement} elem
         * @param {Function} callback
         * @param {string} [ns] - Namespace.
         * @return {domEvent} this
        */
onWheel:function(e,n,i){
// handle MozMousePixelScroll in older Firefox
return this.on(e,"DOMMouseScroll"===P?"MozMousePixelScroll":P,"wheel"===P?n:function(e){e||(e=t.event);var i={originalEvent:e,target:e.target||e.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===e.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){e.preventDefault?e.preventDefault():e.returnValue=!1}};return"mousewheel"===P?(i.deltaY=-.025*e.wheelDelta,e.wheelDeltaX&&(i.deltaX=-.025*e.wheelDeltaX)):i.deltaY=e.detail,n(i)},i)},/*
         * Attach an event handler function for a DOM element.
         * @param {DOMElement} elem
         * @param {string} type
         * @param {Function} callback
         * @param {string} [ns] - Namespace.
         * @return {domEvent} this
        */
on:function(t,e,n,i){return t&&e&&n&&(t.addEventListener(e,n,!1),this._buf.push({elem:t,type:e,callback:n,ns:i})),this},/*
         * Remove an event handler.
         * @param {DOMElement} elem
         * @param {string} type
         * @param {Function} callback
         * @param {string} [ns] - Namespace.
         * @return {domEvent} this
        */
off:function(t,e,n,i){for(var o=this._buf,a=0;a<o.length;a++){var r=o[a];r&&r.elem===t&&r.callback===n&&r.type===e&&r.ns===i&&(t.removeEventListener(e,n,!1),o.splice(a,1),a--)}return this},/*
         * Remove all event handler.
         * @param {string} [ns] - Namespace.
         * @return {domEvent} this
        */
offAll:function(t){for(var e=this._buf,n=0;n<e.length;n++){var i=e[n];t?t===i.ns&&(i.elem.removeEventListener(i.type,i.callback,!1),e.splice(n,1),n--):i.elem.removeEventListener(i.type,i.callback,!1)}return t||(this._buf=[]),this},/*
         * Destructor.
        */
destroy:function(){this.offAll(),delete this._buf}}),W.addExtension("event",function(){this._buf=[]},{/*
         * Attach a handler to an custom event.
         * @param {string} type
         * @param {Function} callback
         * @return {Event} this
        */
on:function(t,e){return t&&e&&this._buf.push({type:t,callback:e}),this},/*
         * Remove a previously-attached custom event handler.
         * @param {string} type
         * @param {Function} callback
         * @return {Event} this
        */
off:function(t,e){for(var n=this._buf,i=0;i<n.length;i++)e===n[i].callback&&t===n[i].type&&(n.splice(i,1),i--);return this},/*
         * Execute all handlers for the given event type.
         * @param {string} type
         * @param {*} [data]
         * @return {Event} this
        */
trigger:function(t,e){for(var n=this._buf,i=0;i<n.length;i++)t===n[i].type&&n[i].callback.call(this,{type:t},e);return this},/*
         * Destructor.
        */
destroy:function(){delete this._buf}}),W.extend(W,{/**
         * Add holidays.
         * @param {string} locale
         * @param {Object} data
         */
addHolidays:function(t,e){this._holidays=this._holidays||{},this._holidays[t]=e}}),W.prototype.getHoliday=function(t,e,n){var i=this._data.locale,a=W._holidays;return a&&a[i]&&a[i][n]?a[i][n][t+"-"+(e+1)]:o},W.extend(W,{_locales:[],_texts:{},/**
         * Add a locale.
         * @param {string} locale
         * @param {Object} texts
         */
addLocale:function(t,e){this._locales.push(t),this._texts[t]=e,e.def&&(this._defaultLocale=t)}}),W.prototype.text=function(t){return W._texts[this._data.locale][t]},W.addExtension("template",null,{/**
         * Get a template.
         * @param {string} name
         * @return {*}
        */
get:function(t){return L(this[t]())},SATURDAY:6,SUNDAY:0,/**
         * Template: days
         * @return {Array}
        */
days:function(){for(var t=[],e=W.MIN_MONTH;e<=W.MAX_MONTH;e++)t.push(this.month(e,this.parent._currentDate.year));return t},/**
         * Template: dayNames
         * @return {Object}
        */
dayNames:function(){for(var t=this.parent.text("firstWeekday")||0,e={first:t,last:t?t-1:this.SATURDAY},n=t,i=0;i<7;i++)e[n]=i,++n>this.SATURDAY&&(n=this.SUNDAY);return e},/**
         * Template: month
         * @param {number} m - Month.
         * @param {number} y - Year.
         * @return {Array}
        */
month:function(t,e){var i=new n;i.setHours(12,0,0,0);for(var o,a,s,l=new n(e,t,1,12,0,0,0),c=l.getTime(),h=this.parent,u=l.getDay(),d=this.dayNames(),f=d[u],_=h.setting("min"),m=h.setting("max"),y=this._getTs(_),p=this._getTs(m),v=i.getTime(),g={t:"tr",c:[u!==d.first?{t:"td",colspan:f,e:"empty",c:f<3?"":this._getTitleMonth(_,m,t,e)}:""]},b={e:"days-month",c:[f<3?this._getTitleMonth(_,m,t,e):"",{t:"table",e:"days-table",c:[g]}]},x=1;l.getMonth()===t;l.setDate(++x)){o="",c=+l,u=l.getDay(),a=h.getHoliday(x,t,e),s={},u===this.SUNDAY||u===this.SATURDAY?s.holiday=!0:s.workday=!0,0===a?s.nonholiday=!0:1===a&&(s.highday=!0),this._isSelected(h._val,x,t,e)&&(s.selected=!0),v===c&&(s.now=!0,o=h.text("today")),(y&&c<y||p&&c>p)&&(s.minmax=!0);var D=h.title.get(r(e,t,x));D&&(s["has-title"]=!0,s["title-color"]=D.color||"default"),u===d.first&&(g={t:"tr",c:[]},b.c[1].c.push(g)),g.c.push({t:"td",e:"day",m:s,title:o,"data-month":t,"data-day":x,c:x})}return b},/**
         * Template: years
         * @return {Array}
        */
years:function(){for(var t=this.parent._data,e=t._startYear,n=t._endYear,i=[{e:"year-selector",c:{e:"year-selector-i"}}],o=e;o<=n;o++)i.push({e:"year","data-year":o,c:o});return i},/**
         * Template: months
         * @return {Array}
        */
months:function(){var t=[{e:"month-selector",c:{e:"month-selector-i"}}];return this.parent.text("months").forEach(function(e,n){t.push({e:"month","data-month":n,c:e})}),t},/**
         * Template: main
         * @return {Array}
        */
main:function(){var t=this.parent,e=t.text("firstWeekday")||this.SUNDAY,n=t.text("dayNames")||[],i=[];return t.text("shortDayNames").forEach(function(t,o,a){i.push({e:"short-daynames-cell",m:{n:e},title:n[e]||a[e],c:a[e]}),++e>this.SATURDAY&&(e=this.SUNDAY)},this),[{e:"short-daynames",c:i},{e:"container",c:[{e:"days",c:{e:"days-container",c:this.days()}},{e:"months",c:this.months()},{e:"years",c:{e:"years-container",c:this.years()}}]}]},/**
         * Destructor.
        */
destroy:function(){},_isSelected:function(t,e,n,i){return e===t.day&&n===t.month&&i===t.year},_getTitleMonth:function(t,e,n,i){function o(t){return p(""+t.year+a(t.month))}var r=o(t),s=o(e),l={},c=p(""+i+a(n));return(t&&c<r||e&&c>s)&&(l.minmax=!0),{e:"days-title-month",m:l,c:this.parent.text("months")[n]}},_getTs:function(t){return t.year?new n(t.year,t.month,t.day,12,0,0,0).getTime():null}}),W.addExtension("timeout",function(){this._buf=[]},{/**
         * Set timeout.
         * @param {Function} callback
         * @param {number} time
         * @param {string} [ns] - Namespace.
         * @return {Timeout} this
        */
set:function(t,e,n){var i=this,o=setTimeout(function(){t(),i.clear(o)},e);return this._buf.push({id:o,ns:n}),o},/**
         * Clear timeout.
         * @param {string} id
         * @return {Timeout} this
        */
clear:function(t){var e=this._buf,n=-1;return e&&(e.some(function(e,i){return e.id===t&&(n=i,!0)}),n>=0&&(clearTimeout(e[n].id),e.splice(n,1))),this},/**
         * Clear all timeouts.
         * @param {string} [ns] - Namespace.
         * @return {Timeout} this
        */
clearAll:function(t){var e=this._buf,n=[],i=Array.isArray(t)?t:[t];return e.forEach(function(e){t?-1!==i.indexOf(e.ns)?clearTimeout(e.id):n.push(e):clearTimeout(e.id)},this),this._buf=t?n:[],this},/**
         * Destructor.
        */
destroy:function(){this.clearAll(),delete this._buf}}),W.addExtension("title",function(){this._title={}},{/**
         * Initialize title.
         * @param {Object} data
        */
init:function(t){this.set(t.title)},/**
         * Get title by date.
         * @param {Date|number|string} date
         * @return {?Object}
        */
get:function(t){var e=l(t);return e?this._title[e]:null},/**
         * Set title by date.
         * @param {Object|Array} data
        */
set:function(t){Array.isArray(t)?t.forEach(function(t){this._set(t)},this):v(t)&&this._set(t)},_set:function(t){var e,n=l(t.date),i=this.parent;n&&(this._title[n]={text:t.text,color:t.color},i._isInited&&(e=i._findDayByDate(c(t.date)))&&(f(e,"has-title"),f(e,"title-color",t.color)))},/**
         * Remove title.
         * @param {Date|number|string} date
        */
remove:function(t){Array.isArray(t)?t.forEach(function(t){this._remove(t)},this):this._remove(t)},_remove:function(t){var e=this.parent,n=l(t);if(n&&(delete this._title[n],e._isInited)){var i=e._findDayByDate(c(t));i&&(d(i,"has-title"),d(i,"title-color"))}},/**
         * Remove all titles.
        */
removeAll:function(){if(this._title={},this.parent._isInited){var t=this.parent._elemAll("day","has-title");if(t)for(var e=0,n=t.length;e<n;e++)d(t[e],"has-title"),d(t[e],"title-color")}},/**
         * Destructor.
        */
destroy:function(){delete this._title}}),W.addExtension("tooltip",null,{/**
         * Show tooltip.
         * @param {DOMElement} target
         * @param {Object} data
         * @param {string} data.text
         * @param {string} data.color
        */
show:function(t,e){var n=e||{};this._create(),f(this._container,"theme",this.parent.setting("theme")),f(this._container,"visible"),this._container.querySelector(".calendula__tooltip-text").innerHTML=L({c:n.text,e:"tooltip-row"}),f(this._container,"color",n.color||"default"),this._isOpened=!0;var i=A(t),o=i.left-(this._container.offsetWidth-t.offsetWidth)/2,a=i.top-this._container.offsetHeight-5;M(this._container,{left:o,top:a})},/**
         * Hide tooltip.
        */
hide:function(){this._isOpened&&(d(this._container,"visible"),this._isOpened=!1)},/**
         * Destructor.
        */
destroy:function(){this._container&&(this.hide(),e.body.removeChild(this._container),delete this._container)},_create:function(){if(!this._container){var t=e.createElement("div");k(t,h("tooltip")),t.innerHTML=L([{e:"tooltip-text"},{e:"tooltip-tail"}]),e.body.appendChild(t),this._container=t}}}),W})}(this,this.document,Date,Math),Calendula.addLocale("be",{months:["студзень","люты","сакавік","красавік","май","чэрвень","ліпень","жнівень","верасень","кастрычнік","лістапад","снежань"],caseMonths:["студзеня","лютага","сакавіка","красавіка","траўня","траўня","ліпеня","жніўня","верасня","кастрычніка","лістапада","снежня"],shortDayNames:["Н","П","А","С","Ч","П","С"],dayNames:["Нядзеля","Панядзелак","Аўторак","Серада","Чацьвер","Пятніца","Субота"],today:"Сення",firstWeekday:1}),Calendula.addLocale("de",{months:["Januar","Februar","Marz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],shortDayNames:["So","Mo","Di","Mi","Do","Fr","Sa"],dayNames:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],today:"Heute",firstWeekday:1}),Calendula.addLocale("en",{months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],today:"Today",firstWeekday:0,def:!0}),Calendula.addLocale("es",{months:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],shortDayNames:["Do","Lu","Ma","Mi","Ju","Vi","S?"],dayNames:["Domingo","Lunes","Martes","Mi?rcoles","Jueves","Viernes","S?bado"],today:"Hoy",firstWeekday:1}),Calendula.addLocale("fr",{months:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],shortDayNames:["Di","Lu","Ma","Me","Je","Ve","Sa"],dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],today:"Aujourd’hui",firstWeekday:1}),Calendula.addLocale("it",{months:["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"],shortDayNames:["Do","Lu","Ma","Me","Gi","Ve","Sa"],dayNames:["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"],today:"Oggi",firstWeekday:1}),Calendula.addLocale("pl",{months:["styczeń","luty","marzec","kwiecień","maj","czerwiec","lipiec","sierpień","wrzesień","październik","listopad","grudzień"],caseMonths:["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"],shortDayNames:["N","P","W","Ś","C","P","S"],dayNames:["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"],today:"Dziś",firstWeekday:1}),Calendula.addLocale("ru",{months:["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"],caseMonths:["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],shortDayNames:["В","П","В","С","Ч","П","С"],dayNames:["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],today:"Сегодня",firstWeekday:1}),Calendula.addLocale("tr",{months:["ocak","şubat","mart","nisan","mayıs","haziran","temmuz","ağustos","eylül","ekim","kasım","aralık"],shortDayNames:["Pz","Pt","Sa","Ça","Pe","Cu","Ct"],dayNames:["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],today:"Bugün",firstWeekday:1}),Calendula.addLocale("uk",{months:["січень","лютий","березень","квітень","травень","червень","липень","серпень","вересень","жовтень","листопад","грудень"],caseMonths:["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"],shortDayNames:["Н","П","В","С","Ч","П","С"],dayNames:["Неділя","Понеділок","Вівторок","Середа","Четвер","П’ятниця","Субота"],today:"Сьогодні",firstWeekday:1}),Calendula.addHolidays("ru",{2012:{"1-1":1,"2-1":1,"3-1":1,"4-1":1,"5-1":1,"6-1":1,"7-1":1,"9-1":1,"23-2":1,"8-3":1,"9-3":1,"11-3":0,"28-4":0,"30-4":1,"1-5":1,"5-5":0,"7-5":1,"8-5":1,"9-5":1,"12-5":0,"9-6":0,"11-6":1,"12-6":1,"4-11":1,"5-11":1,"29-12":0,"31-12":1},2013:{"1-1":1,"2-1":1,"3-1":1,"4-1":1,"5-1":1,"6-1":1,"7-1":1,"8-1":1,"23-2":1,"8-3":1,"1-5":1,"2-5":1,"3-5":1,"9-5":1,"10-5":1,"12-6":1,"4-11":1},2014:{"1-1":1,"2-1":1,"3-1":1,"4-1":1,"5-1":1,"6-1":1,"7-1":1,"8-1":1,"23-2":1,"8-3":1,"10-3":1,"1-5":1,"2-5":1,"9-5":1,"12-6":1,"13-6":1,"3-11":1,"4-11":1},2015:{"1-1":1,"2-1":1,"3-1":1,"4-1":1,"5-1":1,"6-1":1,"7-1":1,"8-1":1,"23-2":1,"8-3":1,"1-5":1,"9-5":1,"12-6":1,"4-11":1},2016:{"1-1":1,"2-1":1,"3-1":1,"4-1":1,"5-1":1,"6-1":1,"7-1":1,"8-1":1,"20-2":0,"22-2":1,"23-2":1,"7-3":1,"8-3":1,"1-5":1,"2-5":1,"3-5":1,"9-5":1,"12-6":1,"13-6":1,"4-11":1}}),Calendula.addHolidays("tr",{2012:{"1-1":1,"23-4":1,"1-5":1,"19-5":1,"30-8":1,"29-10":1},2013:{"1-1":1,"23-4":1,"1-5":1,"19-5":1,"7-8":1,"8-8":1,"9-8":1,"10-8":1,"30-8":1,"14-10":1,"15-10":1,"16-10":1,"17-10":1,"18-10":1,"28-10":1,"29-10":1},2014:{"1-1":1,"23-4":1,"1-5":1,"19-5":1,"27-7":1,"28-7":1,"29-7":1,"30-7":1,"30-8":1,"3-10":1,"4-10":1,"5-10":1,"6-10":1,"28-10":1,"29-10":1},2015:{"1-1":1,"23-4":1,"1-5":1,"19-5":1,"30-8":1,"29-10":1},2016:{"1-1":1,"23-4":1,"1-5":1,"19-5":1,"4-7":1,"5-7":1,"6-7":1,"7-7":1,"30-8":1,"12-9":1,"13-9":1,"14-9":1,"15-9":1,"28-10":1,"29-10":1}}),Calendula.addHolidays("uk",{2012:{"1-1":1,"2-1":1,"6-1":1,"7-1":1,"3-3":0,"8-3":1,"9-3":1,"16-4":1,"28-4":0,"30-4":1,"1-5":1,"2-5":1,"9-5":1,"4-6":1,"28-6":1,"29-6":1,"7-7":0,"24-8":1},2013:{"1-1":1,"7-1":1,"8-3":1,"1-5":1,"2-5":1,"3-5":1,"5-5":1,"6-5":1,"9-5":1,"10-5":1,"18-5":0,"1-6":0,"23-6":1,"24-6":1,"28-6":1,"24-8":1,"26-8":1},2014:{"1-1":1,"2-1":1,"3-1":1,"6-1":1,"7-1":1,"11-1":0,"25-1":0,"8-2":0,"8-3":1,"10-3":1,"20-4":1,"21-4":1,"1-5":1,"2-5":1,"9-5":1,"8-6":1,"9-6":1,"28-6":1,"30-6":1,"24-8":1,"25-8":1},2015:{"1-1":1,"7-1":1,"8-3":1,"1-5":1,"2-5":1,"9-5":1,"28-6":1,"24-8":1},2016:{"1-1":1,"7-1":1,"8-1":1,"16-1":0,"7-3":1,"8-3":1,"12-3":0,"1-5":1,"2-5":1,"3-5":1,"9-5":1,"19-6":1,"20-6":1,"27-6":1,"28-6":1,"2-7":0,"24-8":1,"14-10":1}});