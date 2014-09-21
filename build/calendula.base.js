var Calendula=function(t,e,n,i){"use strict";function o(n){var i={top:0,left:0};return $(n.getBoundingClientRect)||(i=n.getBoundingClientRect()),{top:i.top+(t.pageYOffset||e.scrollTop||0)-(e.clientTop||0),left:i.left+(t.pageXOffset||e.scrollLeft||0)-(e.clientLeft||0)}}function r(t,e,n){s(t,e),a(t,n)}function s(t,e){t.style.left=z(e)?e+"px":e}function a(t,e){t.style.top=z(e)?e+"px":e}function c(){this._buf=[]}function h(){this._buf=[]}function l(){this._buf=[]}function u(){}function f(t){return(10>t?"0":"")+t}function d(t){return(t%4||!(t%100))&&t%400?!1:!0}function _(){this._title={}}function m(){}var p="calendula",y=0,v=11,g=function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},b=function(t){t=g({},t||{});var e=this._prepareYears(t.years),n=g(t,{autocloseable:$(t.autocloseable)?!0:t.autocloseable,closeAfterSelection:$(t.closeAfterSelection)?!0:t.closeAfterSelection,locale:t.locale||b._defaultLocale,min:this._parseDateToObj(t.min),max:this._parseDateToObj(t.max),showOn:t.showOn||"click",theme:t.theme||"default",_startYear:e.start,_endYear:e.end});this._data=n,this._initPlugins([["event",h],["domEvent",l],["template",u],["timeout",c],["title",_],["tooltip",m]]),this.val(n.value),this._addSwitcherEvents(n.showOn)};b.version="0.9.9",g(b.prototype,{isOpened:function(){return this._isOpened},open:function(){var t=this;return this._init(),this._ignoreDocumentClick=!0,this.isOpened()||(this.timeout.set(function(){A(t._container,"opened"),t._update(),t._monthSelector(t._currentDate.month,!1),t._yearSelector(t._currentDate.year,!1),t._openedEvents()},1,"open"),this._isOpened=!0,this.event.trigger("open")),this},close:function(){return this._init(),this.isOpened()&&(this._ignoreDocumentClick=!1,this.timeout.clearAll("open"),this._update(),this._delOpenedEvents(),S(this._container,"opened"),this._isOpened=!1,this.tooltip.hide(),this.event.trigger("close")),this},toggle:function(){return this.isOpened()?this.close:this.open()},val:function(t){return arguments.length?(t?(this._val=this._parseDateToObj(t),this._currentDate=g({},this._val)):(this._val={},this._currentDate=this._current()),this._container&&this._updateSelection(),void this._updateSwitcher()):this._val},setting:function(t,e){var n=this._data,i=this._container,o={min:!0,max:!0,locale:!0};return 1===arguments.length?n[t]:(n[t]="min"===t||"max"===t||"value"===t?this._parseDateToObj(e):e,"showOn"===t&&this._addSwitcherEvents(e),i&&("theme"===t&&A(i,"theme",e),"daysAfterMonths"===t&&(e?A(i,"days-after-months"):S(i,"days-after-months")),o[t]&&this._rebuild()),this)},destroy:function(){this._isInited&&(this.close(),this._removePlugins(),e.body.removeChild(this._container),["_container","_data","_ignoreDocumentClick","_isInited","_isOpened"].forEach(function(t){delete this[t]},this))},_init:function(){if(!this._isInited){this._isInited=!0;var t=this.setting("id"),n=e.createElement("div");this._container=n,t&&(n.id=t),E(n,p),A(n,"theme",this._data.theme),this.setting("daysAfterMonths")&&A(n,"days-after-months"),this._rebuild(),e.body.appendChild(n)}},_current:function(){var t=new n;return{day:t.getDate(),month:t.getMonth(),year:t.getFullYear()}},_update:function(){this._init(),this.setting("switcher")&&this.position()},_resize:function(){this._update()},_rebuild:function(){this._container.innerHTML=this.template.get("main")},_rebuildDays:function(){this._elem("days-container").innerHTML=this.template.get("days"),this._monthSelector(this._currentDate.month,!1)},_openedEvents:function(){var n=this;this._ignoreDocumentClick=!1,this.domEvent.on(e,"click",function(t){!t.button&&n.setting("autocloseable")&&(n._ignoreDocumentClick?n._ignoreDocumentClick=!1:n.close())},"open"),this.domEvent.on(t,"resize",function(){n._resize()},"open").on(e,"keypress",function(t){27===t.keyCode&&n.close()},"open").on(this._container,"click",function(t){t.button||(n._ignoreDocumentClick=!0,n.tooltip.hide())},"open");var i=this._elem("days"),o=this._elem("months"),r=this._elem("years"),s=function(t){var e=0;return t.deltaY>0?e=1:t.deltaY<0&&(e=-1),e};this._onwheelmonths=function(t){var e=s(t);e&&(n._monthSelector(n._currentDate.month+e,!0),t.preventDefault())},this._onwheelyears=function(t){var e=s(t);e&&(n._yearSelector(n._currentDate.year+e,!0),t.preventDefault())},this.domEvent.onWheel(i,this._onwheelmonths,"open").onWheel(o,this._onwheelmonths,"open").onWheel(r,this._onwheelyears,"open"),this.domEvent.on(o,"click",function(t){t.button||Y(t.target,"month")&&n._monthSelector(+D(t.target,"month"),!0)},"open"),this.domEvent.on(r,"click",function(t){if(!t.button){var e=D(t.target,"year");e&&n._yearSelector(+e,!0)}},"open"),this.domEvent.on(i,"mouseover",function(t){var e=t.target,i=D(e,"day"),o=D(e,"month"),r=n._currentDate.year;Y(e,"day")&&T(e,"has-title")&&n.tooltip.show(e,n.title.get(n._internalDate(r,o,i)))},"open"),this.domEvent.on(i,"mouseout",function(t){Y(t.target,"day")&&n.tooltip.hide()},"open"),this.domEvent.on(i,"click",function(t){if(!t.button){var e=n._currentDate,o=t.target,r=D(o,"day"),s=D(o,"month");if(r){if(T(o,"minmax"))return;if(!T(o,"selected")){e.day=+r,e.month=+s;var a=i.querySelector("."+H("day","selected"));a&&S(a,"selected"),A(o,"selected"),n.event.trigger("select",{day:e.day,month:e.month,year:e.year}),n.setting("closeAfterSelection")&&n.close()}}}},"open")},_internalDate:function(t,e,n){return[t,f(e),f(n)].join("-")},_monthSelector:function(t,e){y>t?t=y:t>v&&(t=v),this._currentDate.month=t;var n,i=this._elem("months"),o=this._elem("month").offsetHeight,r=this._elemAll("days-month"),s=r[t],a=this._elem("month-selector"),c=this._elem("days-container"),h=this._elem("days");e||(A(h,"noanim"),A(i,"noanim"));var l=Math.floor(this._currentDate.month*o-o/2);0>=l&&(l=1),l+a.offsetHeight>=i.offsetHeight&&(l=i.offsetHeight-a.offsetHeight-1),I(a,l),n=-Math.floor(s.offsetTop-h.offsetHeight/2+s.offsetHeight/2),n>0&&(n=0);var u=h.offsetHeight-c.offsetHeight;u>n&&(n=u),I(c,n),this._colorizeMonths(t),e||this.timeout.set(function(){S(h,"noanim"),S(i,"noanim")},0,"anim")},_yearSelector:function(t,e){var n=this._data,i=n._startYear,o=n._endYear,r=this._currentDate.year;i>t?t=i:t>o&&(t=o),this._currentDate.year=t;{var s=this._elem("years"),a=this._elem("years-container"),c=this._elem("year").offsetHeight,h=this._elem("year-selector");H("years","noanim")}e||A(s,"noanim");var l=Math.floor((this._currentDate.year-i)*c),u=-Math.floor((this._currentDate.year-i)*c-s.offsetHeight/2);u>0&&(u=0),u<s.offsetHeight-a.offsetHeight&&(u=s.offsetHeight-a.offsetHeight);var f=0;s.offsetHeight>=a.offsetHeight&&((o-i+1)%2&&(f=c),u=Math.floor((s.offsetHeight-a.offsetHeight-f)/2)),t!==r&&this._rebuildDays(t),I(h,l),I(a,u),this._colorizeYears(t),e||this.timeout.set(function(){S(s,"noanim")},0,"anim")},_colorizeMonths:function(t){for(var e=this._elemAll("month"),n=5,i=0;n>i;i++)for(var o=this._elemAll("month","color",i),r=0,s=o.length;s>r;r++)S(o[r],"color",i);A(e[t],"color","0"),t-1>=y&&A(e[t-1],"color","0"),v>=t+1&&A(e[t+1],"color","0");var a=1;for(i=t-2;i>=y&&n>a;i--,a++)A(e[i],"color",a);for(a=1,i=t+2;v>=i&&n>a;i++,a++)A(e[i],"color",a)},_colorizeYears:function(t){for(var e=this._elemAll("year"),n=this._data._startYear,i=5,o=0;i>o;o++)for(var r=this._elemAll("year","color",o),s=0,a=r.length;a>s;s++)S(r[s],"color",o);A(e[t-n],"color","0");var c=1;for(o=t-1;o>=this._data._startYear&&i>c;o--,c++)A(e[o-n],"color",c);for(c=1,o=t+1;o<=this._data._endYear&&i>c;o++,c++)A(e[o-n],"color",c)},_delOpenedEvents:function(){this.domEvent.offAll("open")},_prepareYears:function(t){var e,n,i,o=this._current();return W(t)&&(e=t.trim().split(/[:,; ]/),n=R(e[0]),i=R(e[1]),isNaN(n)||isNaN(i)||(Math.abs(n)<1e3&&(n=o.year+n),Math.abs(i)<1e3&&(i=o.year+i))),{start:n||o.year-11,end:i||o.year+1}},_updateSelection:function(){var t,e=this._elem("day","selected");e&&S(e,"selected"),this._currentDate.year===this._val.year&&(t=this._elemAll("days-month"),t&&t[this._val.month]&&(e=this._elemAllContext(t[this._val.month],"day"),e&&e[this._val.day-1]&&A(e[this._val.day-1],"selected")))},_addSwitcherEvents:function(t){var e=this.setting("switcher"),n=this,i=N(t)?t:[t||"click"];this.domEvent.offAll("switcher"),e&&i.forEach(function(t){n.domEvent.on(e,t,function(){n.open()},"switcher")})},_updateSwitcher:function(){var t,e=this.setting("switcher"),n=this._switcherText();e&&(t=e.tagName.toLowerCase(),"input"===t||"textarea"===t?e.value=n:e.innerHTML=n)},_switcherText:function(){var t=this._currentDate,e=this.text("months"),n=this.text("caseMonths");return t.day+" "+(n||e)[t.month]+" "+t.year}});var w=e.createElement("div"),D=w.dataset?function(t,e){return t.dataset[e]}:function(t,e){return t.getAttribute("data-"+e)},x=!!w.classList,E=x?function(t,e){return t.classList.add(e)}:function(t,e){var n=new RegExp("(^|\\s)"+e+"(\\s|$)","g");n.test(e.className)||(t.className=(t.className+" "+e).replace(/\s+/g," ").replace(/(^ | $)/g,""))},O=x?function(t,e){return t.classList.remove(e)}:function(t,e){var n=new RegExp("(^|\\s)"+e+"(\\s|$)","g");t.className=t.className.replace(n,"$1").replace(/\s+/g," ").replace(/(^ | $)/g,"")},k=x?function(t,e){return t.classList.contains(e)}:function(t,e){var n=new RegExp("(^|\\s)"+e+"(\\s|$)","g");return-1!==t.className.search(n)},H=function(t,e,n){return null===n||n===!1?t="":(n===!0||n===i)&&(n=""),p+"__"+t+(e?"_"+e+(""===n?"":"_"+n):"")},M=function(t,e){return null===e||e===!1?t="":(e===!0||e===i)&&(e=""),p+"_"+t+(""===e?"":"_"+e)},S=function(t,e){var n=L(t),i=n?H(n,e):M(e),o=(t.className||"").split(" ");o.forEach(function(e){(e===i||-1!==e.search(i+"_"))&&O(t,e)})},A=function(t,e,n){var i=L(t);S(t,e),E(t,i?H(i,e,n):M(e,n))},T=function(t,e,n){var i=L(t);return k(t,i?H(i,e,n):M(e,n))},Y=function(t,e){return k(t,H(e))},L=function(t){var e=t.className.match(/__([^ _$]+)/);return e?e[1]:""},C={_elem:function(t,e,n){return this._container.querySelector("."+H(t,e,n))},_elemAll:function(t,e,n){return this._container.querySelectorAll("."+H(t,e,n))},_elemAllContext:function(t,e,n,i){return t.querySelectorAll("."+H(e,n,i))}};g(b.prototype,C);var N=Array.isArray,j=function(t){return"[object Object]"===Object.prototype.toString.call(t)},W=function(t){return"string"==typeof t},z=function(t){return"number"==typeof t},P=function(t){return"object"==typeof t},$=function(t){return"undefined"==typeof t},I=function(){var t=e.createElement("div"),n=!1;return["Moz","Webkit","O","ms",""].forEach(function(e){var i=e+(e?"T":"t")+"ransform";i in t.style&&(n=i)}),n===!1?function(t,e){t.style.top=z(e)?e+"px":e}:function(t,e){t.style[n]="translateY("+(z(e)?e+"px":e)+")"}}();g(b.prototype,{position:function(){var t,e,n,i=this.setting("position")||"left bottom",s=this.setting("switcher"),a=o(s),c=this._container,h=c.offsetWidth,l=c.offsetHeight,u=s.offsetWidth,f=s.offsetHeight;if(W(i)){switch(t=i.trim().split(/ +/),e=a.left,n=a.top,t[0]){case"center":e+=-(h-u)/2;break;case"right":e+=u-h}switch(t[1]){case"top":n+=-l;break;case"center":n+=-(l-f)/2;break;case"bottom":n+=f}}else e=a.left,n=a.top;r(this._container,e,n)}});var R=function(t){return parseInt(t,10)},X=function(){var t=function(n){if(null===n||n===i)return"";var o=[];if(j(n))return e(n);if(N(n)){for(var r=0,s=n.length;s>r;r++)o.push(t(n[r]));return o.join("")}return""+n},e=function(e){var i=e.t||"div",o="<"+i+n(e)+">";return e.c&&(o+=t(e.c)),o+="</"+i+">"},n=function(t){var e,n=Object.keys(t),i=["c","t","e","m"],r=[],s=[],a="";if(t.e&&s.push(H(t.e)),t.m)if(t.e)for(e in t.m)t.m.hasOwnProperty(e)&&s.push(H(t.e,e,t.m[e]));else for(e in t.m)t.m.hasOwnProperty(e)&&s.push(M(e,t.m[e]));s.length&&r.push(o("class",s));for(var e=0,c=n.length;c>e;e++){var h=n[e];-1===i.indexOf(h)&&r.push(o(h,t[h]))}return a=r.join(" "),a?" "+a:""},o=function(t,e){return null!==e&&e!==i?t+'="'+(N(e)?e.join(" "):e)+'"':""};return t}();g(c.prototype,{set:function(t,e,n){var i=this,o=setTimeout(function(){t(),i.clear(o)},e);return this._buf.push({id:o,ns:n}),o},clear:function(t){var e=this._buf,n=-1;e&&(e.some(function(e,i){return e.id===t?(n=i,!0):!1}),n>=0&&(clearTimeout(e[n].id),e.splice(n,1)))},clearAll:function(t){var e=this._buf,n=[];e&&(e.forEach(function(e){t?t===e.ns?clearTimeout(e.id):n.push(e):clearTimeout(e.id)},this),this._buf=t?n:[])},destroy:function(){this.clearAll(),delete this._buf}});var q="onwheel"in e.createElement("div")?"wheel":e.onmousewheel!==i?"mousewheel":"DOMMouseScroll";g(h.prototype,{on:function(t,e){return t&&e&&this._buf.push({type:t,callback:e}),this},off:function(t,e){for(var n=this._buf,i=0;i<n.length;i++)e===n[i].callback&&t===n[i].type&&(n.splice(i,1),i--);return this},trigger:function(t){for(var e=this._buf,n=0;n<e.length;n++)t===e[n].type&&e[n].callback.apply(this,[{type:t}].concat(Array.prototype.slice.call(arguments,1)));return this},destroy:function(){delete this._buf}}),g(l.prototype,{onWheel:function(e,n,i){return this.on(e,"DOMMouseScroll"===q?"MozMousePixelScroll":q,"wheel"===q?n:function(e){e||(e=t.event);var i={originalEvent:e,target:e.target||e.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===e.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){e.preventDefault?e.preventDefault():e.returnValue=!1}},o=-1/40;return"mousewheel"===q?(i.deltaY=o*e.wheelDelta,e.wheelDeltaX&&(i.deltaX=o*e.wheelDeltaX)):i.deltaY=e.detail,n(i)},i)},on:function(t,e,n,i){return t&&e&&n&&(t.addEventListener(e,n,!1),this._buf.push({elem:t,type:e,callback:n,ns:i})),this},off:function(t,e,n,i){for(var o=this._buf,r=0;r<o.length;r++){var s=o[r];s&&s.elem===t&&s.callback===n&&s.type===e&&s.ns===i&&(t.removeEventListener(e,n,!1),o.splice(r,1),r--)}return this},offAll:function(t){for(var e=this._buf,n=0;n<e.length;n++){var i=e[n];t?t===i.ns&&(i.elem.removeEventListener(i.type,i.callback,!1),e.splice(n,1),n--):i.elem.removeEventListener(i.type,i.callback,!1)}return t||(this._buf=[]),this},destroy:function(){this.offAll(),delete this._buf}});var B=6,F=0;return g(u.prototype,{get:function(t){return X(this[t]())},days:function(){for(var t=[],e=y;v>=e;e++)t.push(this.month(e,this.parent._currentDate.year));return t},dayNames:function(){for(var t=this.parent.text("firstWeekday")||0,e={first:t,last:t?t-1:B},n=t,i=0;7>i;i++)e[n]=i,n++,n>B&&(n=F);return e},month:function(t,e){var i=new n(e,t,1,12,0,0,0),o=i.getTime(),r=new n,s=function(t,e,n){var i=_._val;return t===i.day&&e===i.month&&n===i.year},a=function(t){return t.year?new n(t.year,t.month,t.day,12,0,0,0).getTime():null},c=function(){var n=function(t){return R(""+t.year+f(t.month))},i=n(b),o=n(w),r={},s=R(""+e+f(t));return(b&&i>s||w&&s>o)&&(r.minmax=!0),{e:"days-title-month",m:r,c:v}};r.setHours(12),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0);for(var h,l,u,_=this.parent,m=i.getDay(),p=this.dayNames(),y=p[m],v=_.text("months")[t],g=[31,d(e)?29:28,31,30,31,30,31,31,30,31,30,31],b=_.setting("min"),w=_.setting("max"),D=a(b),x=a(w),E=r.getTime(),O={t:"tr",c:[m!==p.first?{t:"td",colspan:y,e:"empty",c:3>y?"":c()}:""]},k=O,H={e:"days-month",c:[3>y?c():"",{t:"table",e:"days-table",c:[k]}]},M=1;M<=g[t];M++){h="",i.setDate(M),m=i.getDay(),l=_.getHoliday(M,t,e),u={},m===F||m===B?u.holiday=!0:u.workday=!0,0===l?u.nonholiday=!0:1===l&&(u.highday=!0),s(M,t,e)&&(u.selected=!0),E===o&&(u.now=!0,h=_.text("today")),(D&&D>o||x&&o>x)&&(u.minmax=!0);var S=_.title.get(_._internalDate(e,t,M));S&&(u["has-title"]=!0,u["title-color"]=S.color||"default"),m===p.first&&(k={t:"tr",c:[]},H.c[1].c.push(k)),k.c.push({t:"td",e:"day",m:u,title:h,"data-month":t,"data-day":M,c:M})}return H},years:function(){for(var t=this.parent._data,e=t._startYear,n=t._endYear,i=[{e:"year-selector",c:{e:"year-selector-i"}}],o=e;n>=o;o++)i.push({e:"year","data-year":o,c:o});return i},months:function(){var t=[{e:"month-selector",c:{e:"month-selector-i"}}];return this.parent.text("months").forEach(function(e,n){t.push({e:"month","data-month":n,c:e})}),t},main:function(){var t=this.parent,e=t.text("firstWeekday")||F,n=t.text("dayNames")||[],i=[];return t.text("shortDayNames").forEach(function(t,o,r){i.push({e:"short-daynames-cell",m:{n:e},title:n[e]||r[e],c:r[e]}),e++,e>B&&(e=F)},this),[{e:"short-daynames",c:i},{e:"container",c:[{e:"days",c:{e:"days-container",c:this.days()}},{e:"months",c:this.months()},{e:"years",c:{e:"years-container",c:this.years()}}]}]}}),g(b,{addHolidays:function(t,e){this._holidays=this._holidays||{},this._holidays[t]=e}}),b.prototype.getHoliday=function(t,e,n){var o=this._data.locale,r=b._holidays;return r&&r[o]&&r[o][n]?r[o][n][t+"-"+(e+1)]:i},g(b.prototype,{_parseDate:function(t){var e,i,o=null;if(t)if(W(t)){if("today"===t)return new n;e=/^\s*(\d{4})[-/.](\d\d)(?:[-/.](\d\d))?\s*$/.exec(t),e?i=[e[3],e[2],e[1]]:(e=/^\s*(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{4}|\d\d))?\s*$/.exec(t),e&&(i=[e[1],e[2],e[3]])),i&&(o=new n(R(i[2]),R(i[1]-1),R(i[0])))}else P(t)?t instanceof n?o=t:t.year&&t.day&&(o=new n(t.year,t.month-1,t.day,12,0,0,0)):z(t)&&(o=new n(t));return o},_parseDateToObj:function(t){var e=this._parseDate(t);return e?{day:e.getDate(),month:e.getMonth(),year:e.getFullYear()}:{}}}),g(b,{_texts:{},_locales:[],addLocale:function(t,e){this._locales.push(t),this._texts[t]=e,e.def&&(this._defaultLocale=t)}}),b.prototype.text=function(t){return b._texts[this._data.locale][t]},g(_.prototype,{init:function(t){this.set(t.title)},get:function(t){return this._title[t]},set:function(t){function e(t){n[t.date]={text:t.text,color:t.color}}var n=this._title;t&&(N(t)?t.forEach(function(t){e(t)}):isPlainObject(t)&&e(t))},remove:function(t){delete this._title[t]},removeAll:function(){this._title={}},destroy:function(){delete this._title}}),g(m.prototype,{create:function(){if(!this._container){var t=e.createElement("div");E(t,H("tooltip")),t.innerHTML=X([{e:"tooltip-text"},{e:"tooltip-tail"}]),e.body.appendChild(t),this._container=t}},show:function(t,e){var n=e||{};this.create(),A(this._container,"theme",this.parent.setting("theme")),A(this._container,"visible"),this._elem("tooltip-text").innerHTML=X({c:n.text,e:"tooltip-row"}),A(this._container,"color",n.color||"default"),this._isOpened=!0;var i=o(t),s=i.left-(this._container.offsetWidth-t.offsetWidth)/2,a=i.top-this._container.offsetHeight-5;r(this._container,s,a)},hide:function(){this._isOpened&&(S(this._container,"visible"),this._isOpened=!1)},destroy:function(){this._container&&(this.hide(),e.body.removeChild(this._container),delete this._container)}}),g(b.prototype,{_initPlugins:function(t){this._plugins=t,t.forEach(function(t){var e=t[0],n=t[1];this[e]=new n,g(this[e],C),this[e].parent=this,this[e].init&&this[e].init(this._data,this._container)},this)},_removePlugins:function(){this._plugins.forEach(function(t){var e=t[0];this[e].destroy(),delete this[e]},this),delete this._plugins}}),b}(this,this.document,Date);