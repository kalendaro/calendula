var Calendula=function(t,e){"use strict";function s(t){return(t%4||!(t%100))&&t%400?!1:!0}var n="calendula",i=0,a=11,o=function(t,e){for(var s in e)e.hasOwnProperty(s)&&(t[s]=e[s]);return t},r=function(t){t=o({},t||{});var e=(new Date,this),s=this._prepareYears(t.years),t=o(t,{autoclose:"undefined"==typeof t.autoclose?!0:t.autoclose,lang:t.lang||r._defaultLang,onselect:t.onselect||function(){},theme:t.theme||"default",_startYear:s.start,_endYear:s.end});e._data=t,this.val(this._data.value)};o(r.prototype,{isOpened:function(){return this._isOpened},open:function(){var t=this;return this._init(),this._ignoreDocumentClick=!0,this.isOpened()||(u.set(function(){t._container.classList.add(h("opened")),t._update(),t._monthSelector(t._currentDate.month,!1),t._yearSelector(t._currentDate.year,!1),t._openedEvents()},1,"open"),this._isOpened=!0),this},close:function(){return this._init(),this.isOpened()&&(this._ignoreDocumentClick=!1,u.clearAll("open"),this._update(),this._container.classList.remove(h("opened")),this._delOpenedEvents(),this._isOpened=!1),this},toggle:function(){return this.isOpened()?this.close():this.open(),this},val:function(t){var e;return arguments.length?void(t?("string"==typeof t?e=Date.parse(t):"object"==typeof t?e=t instanceof Date?t:new Date(t.year,t.month,t.day,12,0,0,0):"number"==typeof number&&(e=new Date(t)),this._val={day:e.getDate(),month:e.getMonth(),year:e.getFullYear()},this._currentDate=o({},this._val)):(this._val={},this._currentDate=this._current())):this._val},setting:function(t,e){if(1===arguments.length)return this._data[t];var s=this._data[t],n=this._container;return this._data[t]=e,n&&("theme"===t&&(n.classList.remove(h("theme",s)),n.classList.add(h("theme",e))),"lang"===t&&this._rebuild()),this},destroy:function(){this._isInited&&(this.close(),u.clearAll(),this._events.offAll(),e.body.removeChild(this._container),["_isInited","_container","_isOpened","_ignoreDocumentClick","_data"].forEach(function(t){delete this[t]},this))},_init:function(){if(!this._isInited){this._templates.parent=this,this._isInited=!0;var t=this,s=this.setting("button"),i=e.createElement("div");this._container=i,i.classList.add(n),i.classList.add(h("theme",this._data.theme)),s&&this._events.on(s,"click",function(){t.toggle()},"init"),this._rebuild(),e.body.appendChild(i)}},_current:function(){var t=new Date;return{day:t.getDate(),month:t.getMonth(),year:t.getFullYear()}},_update:function(){this._init();var t,e=this.setting("button");e&&(t=this._offset(e),t.top+=e.offsetHeight,this._position(this._container,t))},_resize:function(){this._update()},_rebuild:function(){this._container.innerHTML=this.template("main")},_rebuildDays:function(){this._elem("days-container").innerHTML=this._templates.prepare(this._templates.days(this._currentDate.year)),this._monthSelector(this._currentDate.month,!1)},_openedEvents:function(){var s=this;this._ignoreDocumentClick=!1,this._events.on(e,"click",function(t){!t.button&&s.setting("autoclose")&&(s._ignoreDocumentClick?s._ignoreDocumentClick=!1:s.close())},"open"),this._events.on(t,"resize",function(){s._resize()},"open"),this._events.on(this._container,"click",function(t){t.button||(s._ignoreDocumentClick=!0)},"open");var n=this._elem("days"),i=this._elem("months"),a=this._elem("years");this._onwheelmonths=function(t){var e=0;t.deltaY>0?e=1:t.deltaY<0&&(e=-1),e&&(s._monthSelector(s._currentDate.month+e,!0),t.preventDefault())},this._onwheelyears=function(t){var e=0;t.deltaY>0?e=1:t.deltaY<0&&(e=-1),e&&(s._yearSelector(s._currentDate.year+e,!0),t.preventDefault())},this._events.onWheel(n,this._onwheelmonths,"open"),this._events.onWheel(i,this._onwheelmonths,"open"),this._events.onWheel(a,this._onwheelyears,"open"),this._events.on(i,"click",function(t){t.button||t.target.classList.contains(l("month"))&&s._monthSelector(+c(t.target,"month"),!0)},"open"),this._events.on(a,"click",function(t){if(!t.button){var e=c(t.target,"year");e&&s._yearSelector(+e,!0)}},"open"),this._events.on(n,"click",function(t){if(!t.button){var e=l("day","selected"),i=s._currentDate,a=t.target,o=c(a,"day"),r=c(a,"month");if(o&&!a.classList.contains(e)){i.day=+o,i.month=+r;var h=n.querySelector("."+e);h&&h.classList.remove(e),a.classList.add(e),s.setting("onselect")({type:"select"},{day:i.day,month:i.month,year:i.year}),s.close()}}},"open")},_monthSelector:function(t,e){i>t?t=i:t>a&&(t=a),this._currentDate.month=t;var s,n=this._elem("months"),o=this._elem("month").offsetHeight,r=this._elemAll("days-month"),h=this._elem("month-selector"),c=this._elem("days-container"),d=this._elem("days"),f=l("days","noanim"),_=l("months","noanim");e||(d.classList.add(f),n.classList.add(_));var p=Math.floor(this._currentDate.month*o-o/2);0>=p&&(p=1),p+h.offsetHeight>=n.offsetHeight&&(p=n.offsetHeight-h.offsetHeight-1),this._top(h,p),s=-Math.floor(r[t].offsetTop-d.offsetHeight/2+r[t].offsetHeight/2),s>0&&(s=0);var v=d.offsetHeight-c.offsetHeight;v>s&&(s=v),this._top(c,s),this._colorizeMonths(t),e||u.set(function(){d.classList.remove(f),n.classList.remove(_)},0,"anim")},_yearSelector:function(t,e){var s=this._data,n=s._startYear,i=s._endYear,a=this._currentDate.year;n>t?t=n:t>i&&(t=i),this._currentDate.year=t;var o=this._elem("years"),r=this._elem("years-container"),h=this._elem("year").offsetHeight,c=this._elem("year-selector"),n=this._data._startYear,i=this._data._endYear,d=l("years","noanim");e||o.classList.add(d);var f=Math.floor((this._currentDate.year-n)*h),_=-Math.floor((this._currentDate.year-n)*h-o.offsetHeight/2);_>0&&(_=0),_<o.offsetHeight-r.offsetHeight&&(_=o.offsetHeight-r.offsetHeight);var p=0;o.offsetHeight>=r.offsetHeight&&((i-n+1)%2&&(p=h),_=Math.floor((o.offsetHeight-r.offsetHeight-p)/2)),t!==a&&this._rebuildDays(t),this._top(c,f),this._top(r,_),this._colorizeYears(t),e||u.set(function(){o.classList.remove(d)},0,"anim")},_colorizeMonths:function(t){for(var e=this._elemAll("month"),s=5,n=0;s>n;n++)for(var o=this._elemAll("month","color",n),r=0,h=o.length;h>r;r++)o[r].classList.remove(l("month","color",n));var c=l("month","color","0");e[t].classList.add(c),t-1>=i&&e[t-1].classList.add(c),a>=t+1&&e[t+1].classList.add(c);var u=1;for(n=t-2;n>=i&&s>u;n--,u++)e[n].classList.add(l("month","color",u));for(u=1,n=t+2;a>=n&&s>u;n++,u++)e[n].classList.add(l("month","color",u))},_colorizeYears:function(t){for(var e=this._elemAll("year"),s=this._data._startYear,n=5,i=0;n>i;i++)for(var a=this._elemAll("year","color",i),o=0,r=a.length;r>o;o++)a[o].classList.remove(l("year","color",i));e[t-s].classList.add(l("year","color","0"));var h=1;for(i=t-1;i>=this._data._startYear&&n>h;i--,h++)e[i-s].classList.add(l("year","color",h));for(h=1,i=t+1;i<=this._data.endYear&&n>h;i++,h++)e[i-s].classList.add(l("year","color",h))},_delOpenedEvents:function(){this._events.offAll("open")},_prepareYears:function(t){var e,s,n,i=this._current();return"string"==typeof t&&(e=t.trim().split(/[:,; ]/),s=parseInt(e[0],10),n=parseInt(e[1],10),isNaN(s)||isNaN(n)||(Math.abs(s)<1e3&&(s=i.year+s),Math.abs(n)<1e3&&(n=i.year+n))),{start:s||i.year-11,end:n||i.year+1}},_buttonText:function(){var t=this._currentDate,e=this.text("months"),s=this.text("caseMonths");return t.day+" "+(s||e)[t.month]+" "+t.year}});var l=function(t,e,s){return(null===s||void 0===s)&&(s=""),n+"__"+t+(e?"_"+e+(""===s?"":"_"+s):"")},h=function(t,e){return(null===e||void 0===e)&&(e=""),n+"_"+t+(""===e?"":"_"+e)};o(r.prototype,{_elem:function(t,e,s){return this._container.querySelector("."+l(t,e,s))},_elemAll:function(t,e,s){return this._container.querySelectorAll("."+l(t,e,s))},_left:function(t,e){t.style.left=e+"px"},_top:function(t,e){t.style.top=e+"px"},_position:function(t,e){this._left(t,e.left),this._top(t,e.top)},_offset:function(s){var n={top:0,left:0};return"undefined"!=typeof s.getBoundingClientRect&&(n=s.getBoundingClientRect()),{top:n.top+(t.pageYOffset||e.scrollTop||0)-(e.clientTop||0),left:n.left+(t.pageXOffset||e.scrollLeft||0)-(e.clientLeft||0)}}});var c=e.createElement("div").classList?function(t,e){return t.dataset[e]}:function(t,e){return t.getAttribute("data-"+e)},u={_buf:[],set:function(t,e,s){this._buf.push({id:setTimeout(t,e),ns:s})},clear:function(t){this._buf.forEach(function(e,s){e.id===t&&(clearTimeout(t),this._buf.slice(s,1))},this)},clearAll:function(t){this._buf.forEach(function(e,s){t?t===e.ns&&(clearTimeout(e.id),this._buf.slice(s,1)):this._buf.slice(s,1)},this)}},d="onwheel"in e.createElement("div")?"wheel":void 0!==e.onmousewheel?"mousewheel":"DOMMouseScroll";return r.prototype._events={_buf:[],onWheel:function(e,s,n){this.on(e,"DOMMouseScroll"===d?"MozMousePixelScroll":d,"wheel"===d?s:function(e){e||(e=t.event);var n={originalEvent:e,target:e.target||e.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===e.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){e.preventDefault?e.preventDefault():e.returnValue=!1}};return"mousewheel"===d?(n.deltaY=-1/40*e.wheelDelta,e.wheelDeltaX&&(n.deltaX=-1/40*e.wheelDeltaX)):n.deltaY=e.detail,s(n)},n)},on:function(t,e,s,n){t&&e&&s&&(t.addEventListener(e,s,!1),this._buf.push({elem:t,type:e,callback:s,ns:n}))},off:function(t,e,s,n){t&&e&&s&&this._buf.forEach(function(i,a){i&&i.type===e&&i.elem===t&&i.callback===s&&i.ns===n&&(t.removeEventListener(e,s,!1),this._buf.slice(a,1))},this)},offAll:function(t){this._buf.forEach(function(e){e&&this.off(e.elem,e.type,e.callback,t||e.ns)},this),t||(this._buf=[])}},r.prototype.template=function(t){return this._templates[t]()},r.prototype._templates={prepare:function(t){return t.replace(/\$/g,n+"__")},attr:function(t,e){return""===t||null===t||void 0===t?"":" "+t+'="'+e+'"'},days:function(t){for(var e="",s=i;a>=s;s++)e+=this.month(s,t);return e},weekdays:function(){for(var t=this.parent.text("firstWeekDay")||0,e={first:t,last:t?t-1:6},s=t,n=0;7>n;n++)e[s]=n,s++,s>6&&(s=0);return e},month:function(t,e){var n=new Date(e,t,1,12,0,0),i=new Date,a=[i.getDate(),i.getMonth(),i.getFullYear()].join("-"),o=this.parent,r=n.getDay(),l=this.weekdays(),h=l[r],c=o.text("months")[t],u=[31,s(e)?29:28,31,30,31,30,31,31,30,31,30,31],d="",f=[],_=function(){return Array.prototype.join.call(arguments,"-")===a};f.push('<div class="$days-month">'),3>h&&f.push('<div class="$days-title-month">'+c+"</div>"),f.push('<table class="$days-table"><tr>'),r!==l.first&&f.push('<td colspan="'+h+'" class="$empty">'+(3>h?"":'<div class="$days-title-month">'+c+"</div>")+"</td>");for(var p,v,m=o._val.day,y=o._val.month,g=o._val.year,D=1;D<=u[t];D++)v="",p=!1,n.setDate(D),r=n.getDay(),d=0===r||6===r?"$day_holiday":"$day_weekday",D===m&&t===y&&e===g&&(d+=" $day_selected"),_(D,t,e)&&(d+=" $day_now",v=o.text("now")),f.push("<td"+this.attr("title",v)+' class="$day '+d+'" data-month="'+t+'" data-day="'+D+'">'+D+"</td>"),r===l.last&&(f.push("</tr>"),p=!0);return p||f.push("</tr>"),f.push("</table></div>"),f.join("")},years:function(){for(var t='<div class="$year-selector"><div class="$year-selector-i"></div></div>',e=this.parent._data._startYear,s=this.parent._data._endYear,n=e;s>=n;n++)t+='<div class="$year" data-year="'+n+'">'+n+"</div>";return t},months:function(){var t='<div class="$month-selector"><div class="$month-selector-i"></div></div>';return this.parent.text("months").forEach(function(e,s){t+='<div class="$month" data-month="'+s+'">'+e+"</div>"}),t},main:function(){var t=(this.parent.text("shortWeekDays"),this.parent.text("firstWeekDay")||0),e="";return this.parent.text("shortWeekDays").forEach(function(s,n,i){e+='<div class="$short-weekdays-cell $short-weekdays-cell_n_'+t+'"'+this.attr("title",i[t])+">"+i[t]+"</div>",t++,t>6&&(t=0)},this),this.prepare('<div class="$short-weekdays">'+e+'</div><div class="$container"><div class="$days">    <div class="$days-container">'+this.days(this.parent._currentDate.year)+'</div></div><div class="$months">'+this.months()+'</div><div class="$years"><div class="$years-container">'+this.years()+"</div></div></div>")}},o(r,{_texts:{},_langs:[],addLocale:function(t,e){this._langs.push(t),this._texts[t]=e,e.def&&(this._defaultLang=t)}}),r.prototype.text=function(t){return r._texts[this._data.lang][t]},r}(this,this.document);