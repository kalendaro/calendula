(function() {

/* globals isUndefined, isObject, isNumber, isString, isPlainObj, extend */
var assert = chai.assert;

describe('Object', function() {
    it('extend', function() {
        assert.equal(extend({b: 1}, {a: 2}).a, 2);
        assert.equal(extend({b: 1}, {a: 2}).b, 1);
    });

    it('isUndefined', function() {
        assert.isTrue(isUndefined());
        assert.isFalse(isUndefined(1));
        assert.isFalse(isUndefined('hello'));
    });

    it('isObject', function() {
        assert.isTrue(isObject({}));
        assert.isFalse(isObject(1));
    });

    it('isNumber', function() {
        assert.isTrue(isNumber(123));
        assert.isFalse(isNumber({}));
    });

    it('isString', function() {
        assert.isTrue(isString('Hello'));
        assert.isFalse(isString(123));
        assert.isFalse(isString({}));
    });

    it('isPlainObj', function() {
        assert.isTrue(isPlainObj({a: 1}));
        assert.isFalse(isPlainObj(new Date()));
    });
});

})();
