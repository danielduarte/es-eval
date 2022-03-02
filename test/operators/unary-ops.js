const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

// @todo test NaN, +-Infinity and other related values

describe('Unary operations', function () {

  describe('Arithmetic', function () {
    it('unary plus (+)', function () {
      assert.deepStrictEqual(esEval('+8'), 8);
      assert.deepStrictEqual(esEval('+0'), 0);
      assert.deepStrictEqual(esEval('+Infinity'), Infinity);
      assert.deepStrictEqual(esEval('+NaN'), NaN);
      assert.deepStrictEqual(esEval('+undefined'), NaN);
      assert.deepStrictEqual(esEval('+false'), 0);
      assert.deepStrictEqual(esEval('+true'), 1);
      assert.deepStrictEqual(esEval('+""'), 0);
      assert.deepStrictEqual(esEval('+"hi"'), NaN);
      assert.deepStrictEqual(esEval('+"123"'), 123);
      assert.deepStrictEqual(esEval('+{}'), NaN);
      assert.deepStrictEqual(esEval('+{ a: 1 }'), NaN);
      assert.deepStrictEqual(esEval('+[]'), 0);
      assert.deepStrictEqual(esEval('+[12]'), 12);
      assert.deepStrictEqual(esEval('+[1, 2]'), NaN);
    });

    it('unary negation (-)', function () {
      assert.deepStrictEqual(esEval('-8'), -8);
      assert.deepStrictEqual(esEval('-0'), -0);
      assert.deepStrictEqual(esEval('-Infinity'), -Infinity);
      assert.deepStrictEqual(esEval('-NaN'), NaN);
      assert.deepStrictEqual(esEval('-undefined'), NaN);
      assert.deepStrictEqual(esEval('-false'), -0);
      assert.deepStrictEqual(esEval('-true'), -1);
      assert.deepStrictEqual(esEval('-""'), -0);
      assert.deepStrictEqual(esEval('-"hi"'), NaN);
      assert.deepStrictEqual(esEval('-"123"'), -123);
      assert.deepStrictEqual(esEval('-{}'), NaN);
      assert.deepStrictEqual(esEval('-{ a: 1 }'), NaN);
      assert.deepStrictEqual(esEval('-[]'), -0);
      assert.deepStrictEqual(esEval('-[12]'), -12);
      assert.deepStrictEqual(esEval('-[1, 2]'), NaN);
    });
  });

  describe('Bitwise', function () {
    it('bitwise NOT (~)', function () {
      assert.deepStrictEqual(esEval('~123'), -124);
      assert.deepStrictEqual(esEval('~undefined'), -1);
      assert.deepStrictEqual(esEval('~false'), -1);
      assert.deepStrictEqual(esEval('~true'), -2);
      assert.deepStrictEqual(esEval('~""'), -1);
      assert.deepStrictEqual(esEval('~"hi"'), -1);
      assert.deepStrictEqual(esEval('~"123"'), -124);
      assert.deepStrictEqual(esEval('~{}'), -1);
      assert.deepStrictEqual(esEval('~{ a: 1 }'), -1);
      assert.deepStrictEqual(esEval('~[]'), -1);
      assert.deepStrictEqual(esEval('~[12]'), -13);
      assert.deepStrictEqual(esEval('~[1, 2]'), -1);
    });
  });

  describe('Logical', function () {
    it('logical NOT (!)', function () {
      assert.deepStrictEqual(esEval('!8'), false);
      assert.deepStrictEqual(esEval('!0'), true);
      assert.deepStrictEqual(esEval('!undefined'), true);
      assert.deepStrictEqual(esEval('!false'), true);
      assert.deepStrictEqual(esEval('!true'), false);
      assert.deepStrictEqual(esEval('!""'), true);
      assert.deepStrictEqual(esEval('!"hi"'), false);
      assert.deepStrictEqual(esEval('!"0"'), false);
      assert.deepStrictEqual(esEval('!"123"'), false);
      assert.deepStrictEqual(esEval('!{}'), false);
      assert.deepStrictEqual(esEval('!{ a: 1 }'), false);
      assert.deepStrictEqual(esEval('![]'), false);
      assert.deepStrictEqual(esEval('![0]'), false);
      assert.deepStrictEqual(esEval('![12]'), false);
      assert.deepStrictEqual(esEval('![1, 2]'), false);
    });
  });

  describe('General', function () {
    it('can get type (typeof)', function () {
      assert.deepStrictEqual(esEval('typeof 7'), 'number');
      assert.deepStrictEqual(esEval('typeof undefined'), 'undefined');
      assert.deepStrictEqual(esEval('typeof false'), 'boolean');
      assert.deepStrictEqual(esEval('typeof true'), 'boolean');
      assert.deepStrictEqual(esEval('typeof ""'), 'string');
      assert.deepStrictEqual(esEval('typeof "hi"'), 'string');
      assert.deepStrictEqual(esEval('typeof "123"'), 'string');
      assert.deepStrictEqual(esEval('typeof {}'), 'object');
      assert.deepStrictEqual(esEval('typeof { a: 1 }'), 'object');
      assert.deepStrictEqual(esEval('typeof []'), 'object');
      assert.deepStrictEqual(esEval('typeof [1, 2]'), 'object');
    });

    it('can void (void)', function () {
      assert.deepStrictEqual(esEval('void 8'), void 0);
      assert.deepStrictEqual(esEval('void undefined'), void 0);
      assert.deepStrictEqual(esEval('void false'), void 0);
      assert.deepStrictEqual(esEval('void true'), void 0);
      assert.deepStrictEqual(esEval('void ""'), void 0);
      assert.deepStrictEqual(esEval('void "hi"'), void 0);
      assert.deepStrictEqual(esEval('void {}'), void 0);
      assert.deepStrictEqual(esEval('void { a: 1 }'), void 0);
      assert.deepStrictEqual(esEval('void []'), void 0);
      assert.deepStrictEqual(esEval('void [1, 2]'), void 0);
    });

    it('can delete (delete)', function () {
      assert.deepStrictEqual(esEval('delete 8'), true);
      assert.deepStrictEqual(esEval('delete undefined'), false);
      assert.deepStrictEqual(esEval('delete false'), true);
      assert.deepStrictEqual(esEval('delete true'), true);
      assert.deepStrictEqual(esEval('delete ""'), true);
      assert.deepStrictEqual(esEval('delete "hi"'), true);
      assert.deepStrictEqual(esEval('delete {}'), true);
      assert.deepStrictEqual(esEval('delete { a: 1 }'), true);
      assert.deepStrictEqual(esEval('delete []'), true);
      assert.deepStrictEqual(esEval('delete [1, 2]'), true);
    });
  });
});
