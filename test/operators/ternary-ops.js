const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

// @todo test NaN, +-Infinity and other related values

describe('Ternary operations', function () {

  describe('Conditional', function () {
    it('can calculate a conditional (?:)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('1 ? 11 : 22'), 11);
      assert.deepStrictEqual(esEval('0 ? 11 : 22'), 22);

      // Undefined
      assert.deepStrictEqual(esEval('undefined ? undefined : undefined'), void 0);

      // Boolean
      assert.deepStrictEqual(esEval('false ? false : false'), false);
      assert.deepStrictEqual(esEval('false ? false : true'), true);
      assert.deepStrictEqual(esEval('false ? true : false'), false);
      assert.deepStrictEqual(esEval('false ? true : true'), true);
      assert.deepStrictEqual(esEval('true ? false : false'), false);
      assert.deepStrictEqual(esEval('true ? false : true'), false);
      assert.deepStrictEqual(esEval('true ? true : false'), true);
      assert.deepStrictEqual(esEval('true ? true : true'), true);

      // String
      assert.deepStrictEqual(esEval('""   ? "111" : "222"'), "222");
      assert.deepStrictEqual(esEval('"hi" ? "111" : "222"'), "111");
      assert.deepStrictEqual(esEval('"0"  ? "111" : "222"'), "111");
      assert.deepStrictEqual(esEval('"12" ? "111" : "222"'), "111");

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined ? 11 : 22'), 22);
      assert.deepStrictEqual(esEval('1 ? undefined : 22'), void 0);
      assert.deepStrictEqual(esEval('0 ? 11 : undefined'), void 0);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false ? 11 : 22'), 22);
      assert.deepStrictEqual(esEval('1 ? false : 22'), false);
      assert.deepStrictEqual(esEval('0 ? 11 : false'), false);
      assert.deepStrictEqual(esEval('true ? 11 : 22'), 11);
      assert.deepStrictEqual(esEval('1 ? true : 22'), true);
      assert.deepStrictEqual(esEval('0 ? 11 : true'), true);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('undefined ? undefined : false'), false);
      assert.deepStrictEqual(esEval('undefined ? undefined : true'), true);
      assert.deepStrictEqual(esEval('undefined ? false : undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined ? false : false'), false);
      assert.deepStrictEqual(esEval('undefined ? false : true'), true);
      assert.deepStrictEqual(esEval('undefined ? true : undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined ? true : false'), false);
      assert.deepStrictEqual(esEval('undefined ? true : true'), true);
      assert.deepStrictEqual(esEval('false ? undefined : undefined'), void 0);
      assert.deepStrictEqual(esEval('false ? undefined : false'), false);
      assert.deepStrictEqual(esEval('false ? undefined : true'), true);
      assert.deepStrictEqual(esEval('false ? false : undefined'), void 0);
      assert.deepStrictEqual(esEval('false ? false : false'), false);
      assert.deepStrictEqual(esEval('false ? false : true'), true);
      assert.deepStrictEqual(esEval('false ? true : undefined'), void 0);
      assert.deepStrictEqual(esEval('false ? true : false'), false);
      assert.deepStrictEqual(esEval('false ? true : true'), true);
      assert.deepStrictEqual(esEval('true ? undefined : undefined'), void 0);
      assert.deepStrictEqual(esEval('true ? undefined : false'), void 0);
      assert.deepStrictEqual(esEval('true ? undefined : true'), void 0);
      assert.deepStrictEqual(esEval('true ? false : undefined'), false);
      assert.deepStrictEqual(esEval('true ? false : false'), false);
      assert.deepStrictEqual(esEval('true ? false : true'), false);
      assert.deepStrictEqual(esEval('true ? true : undefined'), true);
      assert.deepStrictEqual(esEval('true ? true : false'), true);
      assert.deepStrictEqual(esEval('true ? true : true'), true);
    });
  });
});
