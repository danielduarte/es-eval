const assert = require('assert');
const esEval = require('../..');

describe('Ternary operations (simple cases with positive integer arguments)', function () {

  describe('Conditional', function () {
    it('can calculate a conditional (?:)', function () {
      assert.deepStrictEqual(esEval('1 ? 11 : 22'), 11);
      assert.deepStrictEqual(esEval('0 ? 11 : 22'), 22);
    });
  });
});
