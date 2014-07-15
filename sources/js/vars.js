var NS = 'calendula',
    MIN_MONTH = 0,
    MAX_MONTH = 11;

var extend = function(container, obj) {
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            container[i] = obj[i];
        }
    }
    
    return container;
};
