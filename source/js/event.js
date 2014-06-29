var support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
          document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
          "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

var addWheelListener = function(elem, callback) {
    _addWheelListener(elem, support, callback);

    // handle MozMousePixelScroll in older Firefox
    if(support === 'DOMMouseScroll') {
        _addWheelListener(elem, 'MozMousePixelScroll', callback);
    }
};

var _addWheelListener = function(elem, eventName, callback, useCapture) {
    elem.addEventListener(eventName, support === 'wheel' ? callback : function(originalEvent) {
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
        
        if(support === 'mousewheel') {
            event.deltaY = -1 / 40 * originalEvent.wheelDelta;
            if(originalEvent.wheelDeltaX) {
                event.deltaX = - 1/40 * originalEvent.wheelDeltaX;
            }
        } else {
            event.deltaY = originalEvent.detail;
        }

        return callback(event);
    }, false);
};
