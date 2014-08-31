var supportWheel = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
    'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

extend(Cln.prototype, {
    on: function(type, callback) {
        if(type && callback) {
            this._eventBuf = this._eventBuf || [];
            
            this._eventBuf.push({
                type: type,
                callback: callback
            });
        }
        
        return this;
    },
    off: function(type, callback) {
        if(this._eventBuf) {
            this._eventBuf.forEach(function(el, i) {
                if(type === el.type && callback === el.callback) {
                    this._eventBuf.slice(i, 1);
                }
            });
        }
        
        return this;
    },
    trigger: function(type) {
        var args = arguments;
        if(type && this._eventBuf) {
            this._eventBuf.forEach(function(el, i) {
                if(type === el.type) {
                    el.callback.apply(this, [{type: type}].concat(Array.prototype.slice.call(args, 1)));
                }
            }, this);
        }
        
        return this;
    }
});

var DomEvent = function() {};
extend(DomEvent.prototype, {
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
        
        return this;
    },    
    on: function(elem, type, callback, ns) {
        if(elem && type && callback) {                
            elem.addEventListener(type, callback, false);
            this._buf = this._buf || [];
            this._buf.push({elem: elem, type: type, callback: callback, ns: ns});
        }
        
        return this;
    },
    off: function(elem, type, callback, ns) {
        if(elem && type && callback && this._buf) {
            this._buf.forEach(function(el, i) {
                if(el && el.type === type && el.elem === elem && el.callback === callback && el.ns === ns) {
                    elem.removeEventListener(type, callback, false);
                    this._buf.slice(i, 1);
                }
            }, this);
        }
        
        return this;
    },
    offAll: function(ns) {
        if(this._buf) {
            this._buf.forEach(function(el) {
                if(el) {
                    this.off(el.elem, el.type, el.callback, ns || el.ns);
                }
            }, this);
            
            if(!ns) {
                this._buf = [];
            }
        }
        
        return this;
    }
});
