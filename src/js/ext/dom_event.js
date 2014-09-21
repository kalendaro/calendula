function DomEvent() {
    this._buf = [];
}

extend(DomEvent.prototype, {
    onWheel: function(elem, callback, ns) {
        // handle MozMousePixelScroll in older Firefox
        return this.on(elem,
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
                },
                k = -1 / 40;
                
                if(supportWheel === 'mousewheel') {
                    event.deltaY = k * originalEvent.wheelDelta;
                    if(originalEvent.wheelDeltaX) {
                        event.deltaX = k * originalEvent.wheelDeltaX;
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

            this._buf.push({
                elem: elem,
                type: type,
                callback: callback,
                ns: ns
            });
        }
        
        return this;
    },
    off: function(elem, type, callback, ns) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            var el = buf[i];
            if(el && el.elem === elem && el.callback === callback && el.type === type && el.ns === ns) {
                elem.removeEventListener(type, callback, false);
                buf.splice(i, 1);
                i--;
            }
        }
        
        return this;
    },
    offAll: function(ns) {
        var buf = this._buf;

        for(var i = 0; i < buf.length; i++) {
            var el = buf[i];

            if(ns) {
                if(ns === el.ns) {
                    el.elem.removeEventListener(el.type, el.callback, false);
                    buf.splice(i, 1);
                    i--;
                }
            } else {
                el.elem.removeEventListener(el.type, el.callback, false);
            }
        }
        
        if(!ns) {
            this._buf = [];
        }
        
        return this;
    },
    destroy: function() {
        this.offAll();

        delete this._buf;
    }
});
