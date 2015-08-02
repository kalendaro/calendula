(function() {
/* jshint maxlen:1024 */
/* globals jshtml */
var assert = chai.assert;

describe('jshtml', function() {
    it('type', function() {
        assert.equal(jshtml({}), '<div></div>');
        assert.equal(jshtml(null), '');
        assert.equal(jshtml(false), 'false');
        assert.equal(jshtml(), '');
        assert.equal(jshtml(true), 'true');
    });

    it('tag', function() {
        assert.equal(jshtml({t: 'span', c: 'Hello'}), '<span>Hello</span>');
    });
    
    it('attr', function() {
        assert.equal(jshtml({t: 'span', c: 'Hello', 'data-attr': 1}), '<span data-attr="1">Hello</span>');
    });
    
    it('element', function() {
        assert.equal(jshtml({c: 'Hello', e: 'elem'}), '<div class="calendula__elem">Hello</div>');
    });

    it('modifier', function() {
        assert.equal(jshtml({c: 'Hello', m: {first: true, second: '123'}}), '<div class="calendula_first calendula_second_123">Hello</div>');
        assert.equal(jshtml({c: 'Hello', e: 'elem', m: {first: true, second: '123'}}), '<div class="calendula__elem calendula__elem_first calendula__elem_second_123">Hello</div>');
    });
    
    it('ext', function() {
        assert.equal(jshtml([
            'Hello',
            {
                c: 'Hello'
            },
            {
                t: 'span',
                c: 'Hello'
            },
            {
                e: 'elem'
            },
            {
                m: {first: true}
            }
        ]), 'Hello<div>Hello</div><span>Hello</span><div class="calendula__elem"></div><div class="calendula_first"></div>');
    });

});

})();
