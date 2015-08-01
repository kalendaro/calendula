(function() {
    
/* globals hasClass, addClass, removeClass */
var assert = chai.assert;

describe('Dom', function() {
    it('hasClass', function() {
        var div = document.createElement('div');
        div.className = 'first second';

        assert.isTrue(hasClass(div, 'first'));
        assert.isTrue(hasClass(div, 'second'));
        assert.isFalse(hasClass(div, 'another'));
    });

    it('addClass', function() {
        var div = document.createElement('div');
        addClass(div, 'first');
        addClass(div, 'second');

        assert.equal(div.className, 'first second');
    });

    it('removeClass', function() {
        var div = document.createElement('div');
        div.className = 'first second';
        
        removeClass(div, 'first');
        assert.equal(div.className, 'second');

        removeClass(div, 'second');
        assert.equal(div.className, '');
    });
});

})();
