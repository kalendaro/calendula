(function() {

/* globals leadZero, parseDateToISO, ymdToISO, parseDateToObj */
var assert = chai.assert;

describe('Date', function() {
    it('leadZero', function() {
        assert.equal(leadZero(0), '00');
        assert.equal(leadZero(5), '05');
        assert.equal(leadZero(10), '10');
    });

    it('ymdToISO', function() {
        assert.equal(ymdToISO(2010, 9, 11), '2010-10-11');
    });

    it('parseDateToISO', function() {
        assert.equal(parseDateToISO('2010-10-11'), '2010-10-11');
        assert.equal(parseDateToISO('2010/10/11'), '2010-10-11');
        assert.equal(parseDateToISO('2010.10.11'), '2010-10-11');
        assert.equal(parseDateToISO('10-11-2010'), '2010-11-10');
        assert.equal(parseDateToISO(1438375543579), '2015-07-31');
        assert.equal(parseDateToISO({year: 2000, month: 0, day: 1}), '2000-01-01');
        assert.equal(parseDateToISO(new Date(2010, 09, 11, 0, 0, 0, 0, 0)), '2010-10-11');
    });

    it('parseDateToObj', function() {
        assert.deepEqual(parseDateToObj('2010-10-11'), {year: 2010, month: 9, day: 11});
    });
});

})();
