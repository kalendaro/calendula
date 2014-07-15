var supportWheel = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
    'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

Calendula.prototype._events = {
    _buf: [],
    onWheel: function(elem, callback, ns) {
        // handle MozMousePixelScroll in older Firefox
        this.on(elem,
            supportWheel === 'DOMMouseScroll' ? 'MozMousePixelScroll' : supportWheel,
            supportWheel === 'wheel' ? callback : function(originalEvent) {
                if(!originalEvent) {
                    originalEvent = window.event;
                }

                var event = {
                    originalEvent: originalEvent,
                    target: originalEvent.target || originalEvent.srcElement,
                    type: 'wheel',
                    deltaMode: originalEvent.type === 'MozMousePixelScroll' ? 0 : 1,
                    deltaX: 0,
                    delatZ: 0,
                    preventDefault: function() {
                        originalEvent.preventDefault ?
                            originalEvent.preventDefault() :
                            originalEvent.returnValue = false;
                    }
                };
                
                if(supportWheel === 'mousewheel') {
                    event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                    if(originalEvent.wheelDeltaX) {
                        event.deltaX = -1 / 40 * originalEvent.wheelDeltaX;
                    }
                } else {
                    event.deltaY = originalEvent.detail;
                }

                return callback(event);
        }, ns);
    },    
    on: function(elem, type, callback, ns) {
        if(elem && type && callback) {
            elem.addEventListener(type, callback, false);
            this._buf.push({elem: elem, type: type, callback: callback, ns: ns});
        }
    },
    off: function(elem, type, callback, ns) {
        if(elem && type && callback) {
            this._buf.forEach(function(el, i) {
                if(el && el.type === type && el.elem === elem && el.callback === callback && el.ns === ns) {
                    elem.removeEventListener(type, callback, false);
                    this._buf.slice(i, 1);
                }
            }, this);
        }
    },
    offAll: function(ns) {
        this._buf.forEach(function(el) {
            if(el) {
                this.off(el.elem, el.type, el.callback, ns || el.ns);
            }
        }, this);
        
        if(!ns) {
            this._buf = [];
        }
    }
};
