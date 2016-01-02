(function() {

/* globals setPosition, getOffset, setTranslateY */
var assert = chai.assert;

describe('Offset', function() {
    it('setPosition', function() {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        setPosition(div, {
            left: 100,
            top: 200
        });
        assert.equal(div.style.left, '100px');
        assert.equal(div.style.top, '200px');

        setPosition(div, {
            left: '10em',
            top: '20em'
        });
        assert.equal(div.style.left, '10em');
        assert.equal(div.style.top, '20em');
    });

    it('getOffset', function() {
        var div = document.createElement('div');
        document.body.appendChild(div);
        div.style.position = 'absolute';
        div.style.left = '122px';
        div.style.top = '133px';

        var offset = getOffset(div);
        assert.deepEqual(offset, {
            left: 122,
            top: 133
        });

        document.body.removeChild(div);
    });

    it('setTranslateY', function() {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        setTranslateY(div, 122);
        assert.equal(div.style.WebkitTransform, 'translateY(122px)');

        setTranslateY(div, '12em');
        assert.equal(div.style.WebkitTransform, 'translateY(12em)');
    });
});

})();
