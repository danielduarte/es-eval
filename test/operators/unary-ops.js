const assert = require('assert');
const esEval = require('../..');

describe('Unary operations', function () {

  describe('Arithmetic', function () {
    it('unary plus (+)', function () {
      assert.deepStrictEqual(esEval('+8'), 8);
      assert.deepStrictEqual(esEval('+0'), 0);
      assert.deepStrictEqual(esEval('+undefined'), NaN);
      assert.deepStrictEqual(esEval('+false'), 0);
      assert.deepStrictEqual(esEval('+true'), 1);
    });

    it('unary negation (-)', function () {
      assert.deepStrictEqual(esEval('-8'), -8);
      assert.deepStrictEqual(esEval('-0'), -0);
      assert.deepStrictEqual(esEval('-undefined'), NaN);
      assert.deepStrictEqual(esEval('-false'), -0);
      assert.deepStrictEqual(esEval('-true'), -1);
    });
  });

  describe('Bitwise', function () {
    it('bitwise NOT (~)', function () {
      assert.deepStrictEqual(esEval('~123'), -124);
      assert.deepStrictEqual(esEval('~undefined'), -1);
      assert.deepStrictEqual(esEval('~false'), -1);
      assert.deepStrictEqual(esEval('~true'), -2);
    });
  });

  describe('Logical', function () {
    it('logical NOT (!)', function () {
      assert.deepStrictEqual(esEval('!8'), false);
      assert.deepStrictEqual(esEval('!0'), true);
      assert.deepStrictEqual(esEval('!undefined'), true);
      assert.deepStrictEqual(esEval('!false'), true);
      assert.deepStrictEqual(esEval('!true'), false);
    });
  });

  describe('General', function () {
    it('can get type (typeof)', function () {
      assert.deepStrictEqual(esEval('typeof 7'), 'number');
      assert.deepStrictEqual(esEval('typeof undefined'), 'undefined');
      assert.deepStrictEqual(esEval('typeof false'), 'boolean');
      assert.deepStrictEqual(esEval('typeof true'), 'boolean');
    });

    it('can void (void)', function () {
      assert.deepStrictEqual(esEval('void 8'), void 0);
      assert.deepStrictEqual(esEval('void undefined'), void 0);
      assert.deepStrictEqual(esEval('void false'), void 0);
      assert.deepStrictEqual(esEval('void true'), void 0);
    });

    it('can delete (delete)', function () {
      assert.deepStrictEqual(esEval('delete 8'), true);
      assert.deepStrictEqual(esEval('delete undefined'), false);
      assert.deepStrictEqual(esEval('delete false'), true);
      assert.deepStrictEqual(esEval('delete true'), true);
    });
  });
});
