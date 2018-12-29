var assert = require('assert');

describe('Index  Suite 1', function () {

    it('Test 1: This shouldnt fail', function () {
        assert.ok(true, "This shouldn't fail");
    });

    it('Test 2: This shouldnt fail', function () {
        assert.ok(1 === 1, "This shouldn't fail");
    });

    it('Test 3: should return -1', function () {
        assert.equal([1,2,3].indexOf(4), -1);
    });


});