function leadZero(num) {
    return (num < 10 ? '0' : '') + num;
}

function isLeapYear(y) {
    if(((y % 4 === 0) && (y % 100)) || (y % 400 === 0)) {
        return true;
    }
    
    return false;
}
