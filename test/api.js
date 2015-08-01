(function() {

var assert = chai.assert,
    c;

beforeEach(function() {
    c = new Calendula();
});

afterEach(function() {
    c.destroy();
});

describe('API', function() {
    it('should open popup', function() {
        assert.notOk(c.isOpened());
        c.open();
        assert.ok(c.isOpened());
    });

    it('should close popup', function() {
        assert.notOk(c.isOpened());
        c.open();
        assert.ok(c.isOpened());

        c.close();
        assert.notOk(c.isOpened());
    });

    it('should toggle popup', function() {
        assert.notOk(c.isOpened());
        c.toggle();

        assert.ok(c.isOpened());
        c.toggle();

        assert.notOk(c.isOpened());
        c.toggle();

        assert.ok(c.isOpened());
    });

});

})();
