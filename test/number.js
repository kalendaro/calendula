(function() {

/* globals parseNum */
var assert = chai.assert;

describe('Number', function() {
    it('parseNum', function() {
        assert.equal(parseNum('01'), 1);
        assert.equal(parseNum('2010'), 2010);
        assert.equal(parseNum('09'), 9);
        assert.equal(parseNum('89'), 89);
    });
});

})();
