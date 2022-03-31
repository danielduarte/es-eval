const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Unary operations', function () {

  describe('Arithmetic', function () {
    it('unary plus (+)', function () {
      assert.deepStrictEqual(esEval('+8'), 8);
      assert.deepStrictEqual(esEval('+0'), 0);
      assert.deepStrictEqual(esEval('+NaN'), NaN);
      assert.deepStrictEqual(esEval('+Infinity'), Infinity);
      assert.deepStrictEqual(esEval('+undefined'), NaN);
      assert.deepStrictEqual(esEval('+false'), 0);
      assert.deepStrictEqual(esEval('+true'), 1);
      assert.deepStrictEqual(esEval('+null'), 0);
      assert.deepStrictEqual(esEval('+""'), 0);
      assert.deepStrictEqual(esEval('+"hi"'), NaN);
      assert.deepStrictEqual(esEval('+"123"'), 123);
      assert.deepStrictEqual(esEval('+{}'), NaN);
      assert.deepStrictEqual(esEval('+{ a: 1 }'), NaN);
      assert.deepStrictEqual(esEval('+[]'), 0);
      assert.deepStrictEqual(esEval('+[12]'), 12);
      assert.deepStrictEqual(esEval('+[1, 2]'), NaN);
      assert.deepStrictEqual(esEval('+(() => {})'), NaN);
      assert.deepStrictEqual(esEval('+(x => x)'), NaN);
      assert.deepStrictEqual(esEval('+((x, y) => { const a = 1; return a + x + y; })'), NaN);
    });

    it('unary negation (-)', function () {
      assert.deepStrictEqual(esEval('-8'), -8);
      assert.deepStrictEqual(esEval('-0'), -0);
      assert.deepStrictEqual(esEval('-NaN'), NaN);
      assert.deepStrictEqual(esEval('-Infinity'), -Infinity);
      assert.deepStrictEqual(esEval('-undefined'), NaN);
      assert.deepStrictEqual(esEval('-false'), -0);
      assert.deepStrictEqual(esEval('-true'), -1);
      assert.deepStrictEqual(esEval('-null'), -0);
      assert.deepStrictEqual(esEval('-""'), -0);
      assert.deepStrictEqual(esEval('-"hi"'), NaN);
      assert.deepStrictEqual(esEval('-"123"'), -123);
      assert.deepStrictEqual(esEval('-{}'), NaN);
      assert.deepStrictEqual(esEval('-{ a: 1 }'), NaN);
      assert.deepStrictEqual(esEval('-[]'), -0);
      assert.deepStrictEqual(esEval('-[12]'), -12);
      assert.deepStrictEqual(esEval('-[1, 2]'), NaN);
      assert.deepStrictEqual(esEval('-(() => {})'), NaN);
      assert.deepStrictEqual(esEval('-(x => x)'), NaN);
      assert.deepStrictEqual(esEval('-((x, y) => { const a = 1; return a + x + y; })'), NaN);
    });
  });

  describe('Bitwise', function () {
    it('bitwise NOT (~)', function () {
      assert.deepStrictEqual(esEval('~123'), -124);
      assert.deepStrictEqual(esEval('~NaN'), -1);
      assert.deepStrictEqual(esEval('~Infinity'), -1);
      assert.deepStrictEqual(esEval('~undefined'), -1);
      assert.deepStrictEqual(esEval('~false'), -1);
      assert.deepStrictEqual(esEval('~true'), -2);
      assert.deepStrictEqual(esEval('~null'), -1);
      assert.deepStrictEqual(esEval('~""'), -1);
      assert.deepStrictEqual(esEval('~"hi"'), -1);
      assert.deepStrictEqual(esEval('~"123"'), -124);
      assert.deepStrictEqual(esEval('~{}'), -1);
      assert.deepStrictEqual(esEval('~{ a: 1 }'), -1);
      assert.deepStrictEqual(esEval('~[]'), -1);
      assert.deepStrictEqual(esEval('~[12]'), -13);
      assert.deepStrictEqual(esEval('~[1, 2]'), -1);
      assert.deepStrictEqual(esEval('~(() => {})'), -1);
      assert.deepStrictEqual(esEval('~(x => x)'), -1);
      assert.deepStrictEqual(esEval('~((x, y) => { const a = 1; return a + x + y; })'), -1);
    });
  });

  describe('Logical', function () {
    it('logical NOT (!)', function () {
      assert.deepStrictEqual(esEval('!8'), false);
      assert.deepStrictEqual(esEval('!0'), true);
      assert.deepStrictEqual(esEval('!NaN'), true);
      assert.deepStrictEqual(esEval('!Infinity'), false);
      assert.deepStrictEqual(esEval('!undefined'), true);
      assert.deepStrictEqual(esEval('!false'), true);
      assert.deepStrictEqual(esEval('!true'), false);
      assert.deepStrictEqual(esEval('!null'), true);
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
      assert.deepStrictEqual(esEval('!(() => {})'), false);
      assert.deepStrictEqual(esEval('!(x => x)'), false);
      assert.deepStrictEqual(esEval('!((x, y) => { const a = 1; return a + x + y; })'), false);
    });
  });

  describe('General', function () {
    it('can get type (typeof)', function () {
      assert.deepStrictEqual(esEval('typeof 7'), 'number');
      assert.deepStrictEqual(esEval('typeof NaN'), 'number');
      assert.deepStrictEqual(esEval('typeof Infinity'), 'number');
      assert.deepStrictEqual(esEval('typeof undefined'), 'undefined');
      assert.deepStrictEqual(esEval('typeof false'), 'boolean');
      assert.deepStrictEqual(esEval('typeof true'), 'boolean');
      assert.deepStrictEqual(esEval('typeof null'), 'object');
      assert.deepStrictEqual(esEval('typeof ""'), 'string');
      assert.deepStrictEqual(esEval('typeof "hi"'), 'string');
      assert.deepStrictEqual(esEval('typeof "123"'), 'string');
      assert.deepStrictEqual(esEval('typeof {}'), 'object');
      assert.deepStrictEqual(esEval('typeof { a: 1 }'), 'object');
      assert.deepStrictEqual(esEval('typeof []'), 'object');
      assert.deepStrictEqual(esEval('typeof [1, 2]'), 'object');
      assert.deepStrictEqual(esEval('typeof (() => {})'), 'function');
      assert.deepStrictEqual(esEval('typeof (x => x)'), 'function');
      assert.deepStrictEqual(esEval('typeof ((x, y) => { const a = 1; return a + x + y; })'), 'function');
      assert.deepStrictEqual(esEval('typeof (function (x, y) { const a = 1; return a + x + y; })'), 'function');

      // Special cases
      // @todo: assert.deepStrictEqual(esEval('typeof x'), 'boolean'); // Asking for undefined identifier should not fail
    });

    it('can void (void)', function () {
      assert.deepStrictEqual(esEval('void 8'), void 0);
      assert.deepStrictEqual(esEval('void NaN'), void 0);
      assert.deepStrictEqual(esEval('void Infinity'), void 0);
      assert.deepStrictEqual(esEval('void undefined'), void 0);
      assert.deepStrictEqual(esEval('void false'), void 0);
      assert.deepStrictEqual(esEval('void true'), void 0);
      assert.deepStrictEqual(esEval('void null'), void 0);
      assert.deepStrictEqual(esEval('void ""'), void 0);
      assert.deepStrictEqual(esEval('void "hi"'), void 0);
      assert.deepStrictEqual(esEval('void {}'), void 0);
      assert.deepStrictEqual(esEval('void { a: 1 }'), void 0);
      assert.deepStrictEqual(esEval('void []'), void 0);
      assert.deepStrictEqual(esEval('void [1, 2]'), void 0);
      assert.deepStrictEqual(esEval('void (() => {})'), void 0);
      assert.deepStrictEqual(esEval('void (x => x)'), void 0);
      assert.deepStrictEqual(esEval('void ((x, y) => { const a = 1; return a + x + y; })'), void 0);
    });

    it('can delete (delete)', function () {
      // Delete direct values
      assert.deepStrictEqual(esEval('delete 8'), true);
      assert.deepStrictEqual(esEval('delete NaN'), false);
      assert.deepStrictEqual(esEval('delete Infinity'), false);
      assert.deepStrictEqual(esEval('delete -Infinity'), true);
      assert.deepStrictEqual(esEval('delete undefined'), false);
      assert.deepStrictEqual(esEval('delete false'), true);
      assert.deepStrictEqual(esEval('delete true'), true);
      assert.deepStrictEqual(esEval('delete null'), true);
      assert.deepStrictEqual(esEval('delete ""'), true);
      assert.deepStrictEqual(esEval('delete "hi"'), true);
      assert.deepStrictEqual(esEval('delete {}'), true);
      assert.deepStrictEqual(esEval('delete { a: 1 }'), true);
      assert.deepStrictEqual(esEval('delete []'), true);
      assert.deepStrictEqual(esEval('delete [1, 2]'), true);
      assert.deepStrictEqual(esEval('delete (() => {})'), true);
      assert.deepStrictEqual(esEval('delete (x => x)'), true);
      assert.deepStrictEqual(esEval('delete ((x, y) => { const a = 1; return a + x + y; })'), true);

      // Delete object properties
      assert.deepStrictEqual(esEval('(() => { const obj = { a: 1, b: 2 }; delete obj.a; return obj; })()'), { b: 2 });
      assert.deepStrictEqual(esEval('(() => { const obj = { a: 1, b: 2 }; delete obj["a"]; return obj; })()'), { b: 2 });
      assert.deepStrictEqual(esEval('(() => { const obj = { a: 1, 10: 2 }; delete obj[2*5]; return obj; })()'), { a: 1 });

      // Delete array positions
      assert.deepStrictEqual(esEval('(() => { const arr = [6, 7, 8]; const result = delete arr[0]; return [arr, arr.length, result]; })()'), [(() => { const arr = [6, 7, 8]; delete arr[0]; return arr; })(), 3, true]); // Delete first element
      assert.deepStrictEqual(esEval('(() => { const arr = [6, 7, 8]; const result = delete arr[1]; return [arr, arr.length, result]; })()'), [(() => { const arr = [6, 7, 8]; delete arr[1]; return arr; })(), 3, true]); // Delete element in the middle
      assert.deepStrictEqual(esEval('(() => { const arr = [6, 7, 8]; const result = delete arr[2]; return [arr, arr.length, result]; })()'), [(() => { const arr = [6, 7, 8]; delete arr[2]; return arr; })(), 3, true]); // Delete last element
      assert.deepStrictEqual(esEval('(() => { const arr = [6, 7, 8]; const result = delete arr[1+1]; return [arr, arr.length, result]; })()'), [(() => { const arr = [6, 7, 8]; delete arr[2]; return arr; })(), 3, true]);
      assert.deepStrictEqual(esEval('(() => { const arr = [6, 7, 8]; const result = delete arr[1000]; return [arr, arr.length, result]; })()'), [[6, 7, 8], 3, true]); // Try to delete not existing element
      assert.deepStrictEqual(esEval('(() => { const arr = [6, 7, 8]; const result = delete arr[1]; return arr[1]; })()'), void 0); // Empty elements evaluates to 'undefined'
      assert.deepStrictEqual(esEval('delete [][0]'), true);
    });
  });
});
