var elem = function(name, mod, val) {
    return NS + '__' + name + (mod ? '_' + mod + (val ? '_' + val : '') : '');
};

var mod = function(name, val) {
    return NS + '_' + name + (val ? '_' + val : '');
};

function isLeapYear(y) {
    if ((!(y % 4) && (y % 100)) || !(y % 400)) {
        return true;
    }
    
    return false;
}

