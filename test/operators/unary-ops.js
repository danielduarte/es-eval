const assert = require('assert');
const esEval = require('../..');

describe('Unary operations (simple cases with positive integer arguments)', function () {

  describe('Arithmetic', function () {
    it('unary plus (+)', function () {
      assert.deepStrictEqual(esEval('+8'), 8);
    });

    it('unary negation (-)', function () {
      assert.deepStrictEqual(esEval('-8'), -8);
    });
  });

  describe('Bitwise', function () {
    it('bitwise NOT (~)', function () {
      assert.deepStrictEqual(esEval('~123'), -124);
    });
  });

  describe('Logical', function () {
    it('logical NOT (!)', function () {
      assert.deepStrictEqual(esEval('!8'), false);
      assert.deepStrictEqual(esEval('!0'), true);
    });
  });

  describe('General', function () {
    it('can get type (typeof)', function () {
      assert.deepStrictEqual(esEval('typeof 7'), 'number');
    });

    it('can void (void)', function () {
      assert.deepStrictEqual(esEval('void 8'), void 0);
    });

    it('can delete (delete)', function () {
      assert.deepStrictEqual(esEval('delete 8'), true);
    });
  });
});
