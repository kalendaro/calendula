(function() {
    
/* globals  elem, mod, delMod, setMod, hasMod, hasElem, getElemName */
var assert = chai.assert;

describe('Em', function() {
    it('elem', function() {
        assert.equal(elem('el'), 'calendula__el');
        assert.equal(elem('el', 'm', 'v'), 'calendula__el_m_v');
        assert.equal(elem('el', 'm'), 'calendula__el_m');
        assert.equal(elem('el', 'm', null), 'calendula__el');
        assert.equal(elem('el', 'm', false), 'calendula__el');
        assert.equal(elem('el', 'm', true), 'calendula__el_m');
        assert.equal(elem('el', 'm', 123), 'calendula__el_m_123');
    });

    it('mod', function() {
        assert.equal(mod('m'), 'calendula_m');
        assert.equal(mod('m', 'v'), 'calendula_m_v');
        assert.equal(mod('m'), 'calendula_m');
        assert.equal(mod('m', null), 'calendula');
        assert.equal(mod('m', false), 'calendula');
        assert.equal(mod('m', true), 'calendula_m');
        assert.equal(mod('m', 123), 'calendula_m_123');
    });
    
    it('delMod', function() {
        var div = document.createElement('div');
        div.className = 'calendula calendula_mod calendula_mod2';
        delMod(div, 'mod');
        assert.equal(div.className, 'calendula calendula_mod2');

        div.className = 'calendula calendula__mod';
        delMod(div, 'mod');
        assert.equal(div.className, 'calendula calendula__mod');

        div.className = 'calendula__el calendula__el_mod calendula__el_mod2';
        delMod(div, 'mod');
        assert.equal(div.className, 'calendula__el calendula__el_mod2');
    });

    it('setMod', function() {
        var div = document.createElement('div');
        div.className = 'calendula calendula_mod2';
        setMod(div, 'mod');
        assert.equal(div.className, 'calendula calendula_mod2 calendula_mod');

        div.className = 'calendula__elem';
        setMod(div, 'mod', 1);
        assert.equal(div.className, 'calendula__elem calendula__elem_mod_1');

        div.className = 'calendula__el calendula__el_mod calendula__el_mod2';
        setMod(div, 'mod2', '22');
        assert.equal(div.className, 'calendula__el calendula__el_mod calendula__el_mod2_22');
    });
    
    it('hasMod', function() {
        var div = document.createElement('div');
        div.className = 'calendula calendula_mod2';
        assert.isTrue(hasMod(div, 'mod2'));

        div.className = 'calendula__elem calendula__elem_mod2';
        assert.isFalse(hasMod(div, 'mod'));

        div.className = 'calendula__elem calendula__elem_mod2';
        assert.isTrue(hasMod(div, 'mod2'));

        div.className = 'calendula__elem calendula__elem_mod2_2';
        assert.isTrue(hasMod(div, 'mod2', '2'));
    });
    
    it('hasElem', function() {
        var div = document.createElement('div');
        div.className = 'calendula__elem';
        assert.isTrue(hasElem(div, 'elem'));

        div.className = 'calendula__elem calendula__elem2';
        assert.isTrue(hasElem(div, 'elem2'));

        div.className = 'calendula__elem2';
        assert.isFalse(hasElem(div, 'elem'));

        div.className = 'calendula';
        assert.isFalse(hasElem(div, 'elem'));
    });
    
    it('getElemName', function() {
        var div = document.createElement('div');
        div.className = 'calendula calendula__mod';
        assert.equal(getElemName(div), 'mod');

        div.className = 'calendula calendula_mod';
        assert.equal(getElemName(div), '');

        div.className = 'calendula';
        assert.equal(getElemName(div), '');
    });
});

})();
