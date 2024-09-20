const { describe, it } = require('mocha');
const assert = require('assert');
const { assertError } = require('../utils');
const esEval = require('../..');


describe('Array static built-in properties and methods', function () {

  // it('Array constructor exists and is valid', function () {
  //   assert.deepStrictEqual(esEval('typeof Array'), 'function'); // @todo(fix) return correct type for built-in constructors
  // });

  it('isArray', function () {
    assert.deepStrictEqual(esEval('typeof Array.isArray'), 'function');

    // Number
    assert.deepStrictEqual(esEval('Array.isArray(0)'), false);
    assert.deepStrictEqual(esEval('Array.isArray(-0)'), false);
    assert.deepStrictEqual(esEval('Array.isArray(-12.89)'), false);
    assert.deepStrictEqual(esEval('Array.isArray(12.89)'), false);
    assert.deepStrictEqual(esEval('Array.isArray(NaN)'), false);
    assert.deepStrictEqual(esEval('Array.isArray(Infinity)'), false);
    assert.deepStrictEqual(esEval('Array.isArray(-Infinity)'), false);

    // Undefined
    assert.deepStrictEqual(esEval('Array.isArray()'), false);
    assert.deepStrictEqual(esEval('Array.isArray(undefined)'), false);

    // Boolean
    assert.deepStrictEqual(esEval('Array.isArray(false)'), false);
    assert.deepStrictEqual(esEval('Array.isArray(true)'), false);

    // Object
    assert.deepStrictEqual(esEval('Array.isArray(null)'), false);
    assert.deepStrictEqual(esEval('Array.isArray({})'), false);
    assert.deepStrictEqual(esEval('Array.isArray({ length: 6 })'), false);
    assert.deepStrictEqual(esEval('Array.isArray({ a: 1 })'), false);
    assert.deepStrictEqual(esEval('Array.isArray({ "a": 1 })'), false);
    assert.deepStrictEqual(esEval('Array.isArray({ ["a"]: 1 })'), false);

    // Array
    assert.deepStrictEqual(esEval('Array.isArray([])'), true);
    assert.deepStrictEqual(esEval('Array.isArray([""])'), true);
    assert.deepStrictEqual(esEval('Array.isArray(["", 56.78])'), true);
    assert.deepStrictEqual(esEval('Array.isArray([false])'), true);
    assert.deepStrictEqual(esEval('Array.isArray([NaN])'), true);
    assert.deepStrictEqual(esEval('Array.isArray([Infinity])'), true);
    assert.deepStrictEqual(esEval('Array.isArray([undefined])'), true);
    assert.deepStrictEqual(esEval('Array.isArray([{}])'), true);
    assert.deepStrictEqual(esEval('Array.isArray([[[[]]]])'), true);

    // String
    assert.deepStrictEqual(esEval('Array.isArray("[]")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("undefined")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("NaN")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("Infinity")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("-Infinity")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("false")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("true")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("null")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("")'), false);
    assert.deepStrictEqual(esEval(`Array.isArray("''")`), false);
    assert.deepStrictEqual(esEval(`Array.isArray('""')`), false);
    assert.deepStrictEqual(esEval('Array.isArray("any string")'), false);
    assert.deepStrictEqual(esEval('Array.isArray("0")'), false);
    assert.deepStrictEqual(esEval('Array.isArray(() => "12.89")'), false);
  });
});

describe('Array prototype built-in properties and methods', function () {

  it('indexed access', function () {
    assert.deepStrictEqual(esEval('["a", "b"][1]'), 'b');
    assert.deepStrictEqual(esEval('["a", "b"][-1]'), void 0);
    assert.deepStrictEqual(esEval('["a", "b"][2]'), void 0);
    assert.deepStrictEqual(esEval('[][5]'), void 0);
    assert.deepStrictEqual(esEval('[123]["0"]'), 123);
    assert.deepStrictEqual(esEval('[123]["string key"]'), void 0);
    assert.deepStrictEqual(esEval('[][null]'), void 0);
  });

  it('length', function () {
    assert.deepStrictEqual(esEval('typeof [].length'), 'number');
    assert.deepStrictEqual(esEval('[].length'), 0);
    assert.deepStrictEqual(esEval('[6, 6, 6, 6].length'), 4);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4]; a.length = 8; return a.length; })()'), 8);
  });

  it('push', function () {
    // Basic behavior
    assert.deepStrictEqual(esEval('typeof [].push'), 'function');
    assert.deepStrictEqual(esEval('[].push(5)'), 1);
    assert.deepStrictEqual(esEval('[undefined].push(5)'), 2);
    assert.deepStrictEqual(esEval('[].push(6, 5, 4, 3, 2, 1)'), 6);
    assert.deepStrictEqual(esEval('[8, 7].push(6, 5, 4, 3, 2, 1)'), 8);
    assert.deepStrictEqual(esEval('(() => { const a = [7, 6]; const count = a.push(5); return { array: a, count: count }; })()'), { array: [7, 6, 5], count: 3 });
    assert.deepStrictEqual(esEval('(() => { const a = []; a.push(null, undefined, NaN, Infinity); return a; })()'), [null, void 0, NaN, Infinity]);
  });

  it('map', function () {
    // @todo(test) add tests for the thisArg parameter when supported (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    assert.deepStrictEqual(esEval('typeof [].map'), 'function');
    assert.deepStrictEqual(esEval('[].map(x => x)'), []);
    assert.deepStrictEqual(esEval('[3, 4, 5].map(x => x)'), [3, 4, 5]);
    assert.deepStrictEqual(esEval('[3, 4, 5].map(x => 2 * x)'), [6, 8, 10]);
    assert.deepStrictEqual(esEval('(() => { const a = [2, 4, 6]; const b = a.map(x => x / 2); return { a: a, b: b }; })()'), { a: [2, 4, 6], b: [1, 2, 3] });
    assert.deepStrictEqual(esEval('(() => { const fn = x => "[" + x + "]"; return [[1, 2, 3].map(fn), [undefined, "a", "b"].map(fn)]; })()'), [["[1]", "[2]", "[3]"], ["[undefined]", "[a]", "[b]"]]);
  });

  it('reduce', function () {
    assert.deepStrictEqual(esEval('typeof [].reduce'), 'function');
    assert.deepStrictEqual(esEval('[1, 2, 3, 4].reduce((acc, elem) => acc + elem, 1000)'), 1000 + 1 + 2 + 3 + 4);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4].reduce((acc, elem) => acc + elem)'), 1 + 2 + 3 + 4);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4].reduce((acc, elem) => acc + elem, undefined)'), NaN);
    assert.deepStrictEqual(esEval('["A", "B", "C"].reduce((acc, elem, ix) => { acc.push(elem + " at " + ix); return acc; }, [])'), ['A at 0', 'B at 1', 'C at 2']);
    assert.deepStrictEqual(esEval('["A", "B", "C"].reduce((acc, elem, i, array) => { if (i === 1) array.push("?"); acc.push(array.length); return acc; }, [])'), [3, 4, 4]);
  });

  it('includes', function () {
    assert.deepStrictEqual(esEval('typeof [].includes'), 'function');
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].includes(3)'), true);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].includes(3, 2)'), true);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].includes(3, 3)'), false);
    assert.deepStrictEqual(esEval('[{ a: 1 }].includes({ a: 1 })'), false);
    assert.deepStrictEqual(esEval('(() => { const o = { a: 1 }; return [o].includes(o); })()'), true);
    assert.deepStrictEqual(esEval('[function () {}].includes(function () {})'), false);
    assert.deepStrictEqual(esEval('(() => { const fn = function () {}; return [fn].includes(fn); })()'), true);
  });

  it('filter', function () {
    assert.deepStrictEqual(esEval('typeof [].filter'), 'function');
    assertError(() => esEval('[].filter()'), 'Function expected');


    // Simple cases
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].filter(() => true)'), [1, 2, 3, 4, 5]);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].filter(() => false)'), []);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].filter(x => x > 3)'), [4, 5]);

    // Use of 'this' - non-object 'this'
    assert.deepStrictEqual(esEval('[1, 2, 3, undefined, undefined, 4, undefined, null, "a", null].filter(function (elem) { return elem === this; })'), [void 0, void 0, void 0]); // This case may differ from browser behavior because of the default 'this'
    assert.deepStrictEqual(esEval('[1, 2, 3, undefined, undefined, 4, undefined, null, "a", null].filter(function (elem) { return elem === this; }, undefined)'), [void 0, void 0, void 0]); // This case may differ from browser behavior because of the default 'this'
    assert.deepStrictEqual(esEval('[1, 2, 3, undefined, undefined, 4, undefined, null, "a", null].filter(function (elem) { return elem === this; }, null)'), [null, null]); // This case may differ from browser behavior because of the default 'this'

    // Use of 'this' - object 'this'
    assert.deepStrictEqual(esEval('[1, 2, 3, undefined, undefined, 4, undefined, null, "a", null].filter(function (elem) { return elem === this.val; }, { val: undefined })'), [void 0, void 0, void 0]);
    assert.deepStrictEqual(esEval('[1, 2, 3, undefined, undefined, 4, undefined, null, "a", null].filter(function (elem) { return elem === this.val; }, { val: null })'), [null, null]);
    assert.deepStrictEqual(esEval('[1, 2, 3, undefined, undefined, 4, undefined, null, "a", null].filter(function (elem) { return elem === this.val; }, { val: 2 })'), [2]);
    assert.deepStrictEqual(esEval('[1, 2, 3, undefined, undefined, 4, undefined, null, "a", null].filter(function (elem) { return elem === this.val; }, { val: "a" })'), ['a']);
  });

  it('pop', function () {
    assert.deepStrictEqual(esEval('typeof [].pop'), 'function');
    assert.deepStrictEqual(esEval('[4, 5, 6].pop()'), 6);
    assert.deepStrictEqual(esEval('[4, 5, 6].pop(undefined)'), 6);
    assert.deepStrictEqual(esEval('[4, 5, 6].pop(7)'), 6);
    assert.deepStrictEqual(esEval('(() => { const a = [6, 7, 8]; a.pop(); return a; })()'), [6, 7]);
  });

  it('shift', function () {
    assert.deepStrictEqual(esEval('typeof [].shift'), 'function');
    assert.deepStrictEqual(esEval('[4, 5, 6].shift()'), 4);
    assert.deepStrictEqual(esEval('[4, 5, 6].shift(undefined)'), 4);
    assert.deepStrictEqual(esEval('[4, 5, 6].shift(7)'), 4);
    assert.deepStrictEqual(esEval('(() => { const a = [6, 7, 8]; a.shift(); return a; })()'), [7, 8]);
  });

  it('unshift', function () {
    assert.deepStrictEqual(esEval('typeof [].unshift'), 'function');
    assert.deepStrictEqual(esEval('[].unshift(5)'), 1);
    assert.deepStrictEqual(esEval('[undefined].unshift(5)'), 2);
    assert.deepStrictEqual(esEval('[].unshift(6, 5, 4, 3, 2, 1)'), 6);
    assert.deepStrictEqual(esEval('[8, 7].unshift(6, 5, 4, 3, 2, 1)'), 8);
    assert.deepStrictEqual(esEval('(() => { const a = [7, 6]; const count = a.unshift(5); return { array: a, count: count }; })()'), { array: [5, 7, 6], count: 3 });
    assert.deepStrictEqual(esEval('(() => { const a = []; a.unshift(null, undefined, NaN, Infinity); return a; })()'), [null, void 0, NaN, Infinity]);
  });

  it('slice', function () {
    assert.deepStrictEqual(esEval('typeof [].slice'), 'function');
    assert.deepStrictEqual(esEval('[4, 5, 6].slice()'), [4, 5, 6]);

    assert.deepStrictEqual(esEval(`(() => {
      const original = [6, 7, 8];
      const copy = original.slice();
      original.push('A');
      copy.push('B');
      return { original: original, copy: copy };
    })()`), { original: [6, 7, 8, 'A'], copy: [6, 7, 8, 'B'] });

    assert.deepStrictEqual(esEval(`[
      ["a", "b", "c", "d"].slice(0),
      ["a", "b", "c", "d"].slice(1),
      ["a", "b", "c", "d"].slice(2),
      ["a", "b", "c", "d"].slice(3),
      ["a", "b", "c", "d"].slice(4),
      ["a", "b", "c", "d"].slice(5),
      ["a", "b", "c", "d"].slice(-1),
      ["a", "b", "c", "d"].slice(-2),
      ["a", "b", "c", "d"].slice(-3),
      ["a", "b", "c", "d"].slice(-4),
      ["a", "b", "c", "d"].slice(-5),
    ]`), [
      ['a', 'b', 'c', 'd'],
      ['b', 'c', 'd'],
      ['c', 'd'],
      ['d'],
      [],
      [],
      ['d'],
      ['c', 'd'],
      ['b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
    ]);

    assert.deepStrictEqual(esEval(`[
      ["a", "b", "c", "d"].slice(NaN),
      ["a", "b", "c", "d"].slice(Infinity),
      ["a", "b", "c", "d"].slice(-Infinity),
      ["a", "b", "c", "d"].slice(undefined),
      ["a", "b", "c", "d"].slice(null),
      ["a", "b", "c", "d"].slice([]),
      ["a", "b", "c", "d"].slice({}),
      ["a", "b", "c", "d"].slice(true),
      ["a", "b", "c", "d"].slice(false),
      ["a", "b", "c", "d"].slice(''),
      ["a", "b", "c", "d"].slice('x'),
    ]`), [
      ['a', 'b', 'c', 'd'],
      [],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
    ]);

    assert.deepStrictEqual(esEval(`[
      ["a", "b", "c", "d"].slice(undefined, 0),
      ["a", "b", "c", "d"].slice(undefined, 1),
      ["a", "b", "c", "d"].slice(undefined, 2),
      ["a", "b", "c", "d"].slice(undefined, 3),
      ["a", "b", "c", "d"].slice(undefined, 4),
      ["a", "b", "c", "d"].slice(undefined, 5),
      ["a", "b", "c", "d"].slice(undefined, -1),
      ["a", "b", "c", "d"].slice(undefined, -2),
      ["a", "b", "c", "d"].slice(undefined, -3),
      ["a", "b", "c", "d"].slice(undefined, -4),
      ["a", "b", "c", "d"].slice(undefined, -5),
    ]`), [
      [],
      ['a'],
      ['a', 'b'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c'],
      ['a', 'b'],
      ['a'],
      [],
      [],
    ]);

    assert.deepStrictEqual(esEval(`[
      ["a", "b", "c", "d"].slice(1, 0),
      ["a", "b", "c", "d"].slice(1, 1),
      ["a", "b", "c", "d"].slice(1, 2),
      ["a", "b", "c", "d"].slice(1, 3),
      ["a", "b", "c", "d"].slice(1, 4),
      ["a", "b", "c", "d"].slice(1, 5),
      ["a", "b", "c", "d"].slice(1, -1),
      ["a", "b", "c", "d"].slice(1, -2),
      ["a", "b", "c", "d"].slice(1, -3),
      ["a", "b", "c", "d"].slice(1, -4),
      ["a", "b", "c", "d"].slice(1, -5),
    ]`), [
      [],
      [],
      ['b'],
      ['b', 'c'],
      ['b', 'c', 'd'],
      ['b', 'c', 'd'],
      ['b', 'c'],
      ['b'],
      [],
      [],
      [],
    ]);

    assert.deepStrictEqual(esEval(`[
      ["a", "b", "c", "d"].slice(1, NaN),
      ["a", "b", "c", "d"].slice(1, Infinity),
      ["a", "b", "c", "d"].slice(1, -Infinity),
      ["a", "b", "c", "d"].slice(1, undefined),
      ["a", "b", "c", "d"].slice(1, null),
      ["a", "b", "c", "d"].slice(1, []),
      ["a", "b", "c", "d"].slice(1, {}),
      ["a", "b", "c", "d"].slice(1, true),
      ["a", "b", "c", "d"].slice(1, false),
      ["a", "b", "c", "d"].slice(1, ''),
      ["a", "b", "c", "d"].slice(1, 'x'),
    ]`), [
      [],
      ['b', 'c', 'd'],
      [],
      ['b', 'c', 'd'],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ]);

    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].slice(2, -2)'), [3]);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].slice(-3, 3)'), [3]);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].slice(-3, -2)'), [3]);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].slice(2, 3)'), [3]);
  });

  it('splice', function () {
    assert.deepStrictEqual(esEval('typeof [].splice'), 'function');

    // No params
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(); return [a, b]; })()'), [[3, 4, 5], []]);

    // 1 param
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined); return [a, b]; })()'), [[], [3, 4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(0); return [a, b]; })()'), [[], [3, 4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(1); return [a, b]; })()'), [[3], [4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2); return [a, b]; })()'), [[3, 4], [ 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(3); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(4); return [a, b]; })()'), [[3, 4, 5], []]);

    // 2 params
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined, undefined); return [a, b]; })()'),  [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(0, undefined); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(1, undefined); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, undefined); return [a, b]; })()'), [[3, 4, 5], [ ]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(3, undefined); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(4, undefined); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined, 0); return [a, b]; })()'),  [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(0, 0); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(1, 0); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 0); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(3, 0); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(4, 0); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined, 1); return [a, b]; })()'),  [[4, 5], [3]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(0, 1); return [a, b]; })()'), [[4, 5], [3]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(1, 1); return [a, b]; })()'), [[3, 5], [4]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 1); return [a, b]; })()'), [[3, 4], [5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(3, 1); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(4, 1); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined, 2); return [a, b]; })()'),  [[5], [3, 4]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(0, 2); return [a, b]; })()'), [[5], [3, 4]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(1, 2); return [a, b]; })()'), [[3], [4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 2); return [a, b]; })()'), [[3, 4], [5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(3, 2); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(4, 2); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined, 3); return [a, b]; })()'),  [[], [3, 4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(0, 3); return [a, b]; })()'), [[], [3, 4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(1, 3); return [a, b]; })()'), [[3], [4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 3); return [a, b]; })()'), [[3, 4], [5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(3, 3); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(4, 3); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined, 4); return [a, b]; })()'),  [[], [3, 4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(0, 4); return [a, b]; })()'), [[], [3, 4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(1, 4); return [a, b]; })()'), [[3], [4, 5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 4); return [a, b]; })()'), [[3, 4], [5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(3, 4); return [a, b]; })()'), [[3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(4, 4); return [a, b]; })()'), [[3, 4, 5], []]);

    // 3+ params
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(undefined, undefined, true, NaN, 9, undefined); return [a, b]; })()'),  [[true, NaN, 9, undefined, 3, 4, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, undefined, true, NaN, 9, undefined); return [a, b]; })()'), [[3, 4, true, NaN, 9, undefined, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 0, true, NaN, 9, undefined); return [a, b]; })()'), [[3, 4, true, NaN, 9, undefined, 5], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 1, true, NaN, 9, undefined); return [a, b]; })()'), [[3, 4, true, NaN, 9, undefined], [5]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5]; const b = a.splice(2, 2, true, NaN, 9, undefined); return [a, b]; })()'), [[3, 4, true, NaN, 9, undefined], [5]]);

    // negative params
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(-2, undefined); return [a, b]; })()'), [[3, 4, 5, 6, 7, 8], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(-2); return [a, b]; })()'), [[3, 4, 5, 6], [7, 8]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(-2, 1); return [a, b]; })()'), [[3, 4, 5, 6, 8], [7]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(2, -1); return [a, b]; })()'), [[3, 4, 5, 6, 7, 8], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(-2, -1); return [a, b]; })()'), [[3, 4, 5, 6, 7, 8], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(-2, undefined, -3); return [a, b]; })()'), [[3, 4, 5, 6, -3, 7, 8], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(-2, 1, -3); return [a, b]; })()'), [[3, 4, 5, 6, -3, 8], [7]]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(2, -1, -3); return [a, b]; })()'), [[3, 4, -3, 5, 6, 7, 8], []]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4, 5, 6, 7, 8]; const b = a.splice(-2, -1, -3); return [a, b]; })()'), [[3, 4, 5, 6, -3, 7, 8], []]);
  });

  it('forEach', function () {
    assert.deepStrictEqual(esEval('typeof [].forEach'), 'function');
    assert.deepStrictEqual(esEval('[].forEach(() => {})'), void 0);
    assert.deepStrictEqual(esEval('[1, 2, 3].forEach(() => {})'), void 0);
    assertError(() => esEval('[].forEach()'), 'Function expected');

    assert.deepStrictEqual(esEval(`(() => {
      const array = [{a:1},{b:2},3];
      const result = array.forEach((elem, ix, a) => {
        elem.x = ix;
        array[ix].y = ix;
      });
      return [array, result];
    })()`), [[{a:1,x:0,y:0},{b:2,x:1,y:1},3], void 0]);
  });

  it('find', function () {
    // @todo(test) add tests for the thisArg parameter when supported (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
    assert.deepStrictEqual(esEval('typeof [].find'), 'function');
    assertError(() => esEval('[1, 2, 3, 4].find()'), 'undefined is not a function');

    assert.deepStrictEqual(esEval('[].find(x => x)'), void 0);
    assert.deepStrictEqual(esEval('[].find(() => false)'), void 0);
    assert.deepStrictEqual(esEval('[].find(() => true)'), void 0);
    assert.deepStrictEqual(esEval('[4, 3, 2, 1].find(x => x)'), 4);
    assert.deepStrictEqual(esEval('[4, 3, 2, 1].find(() => false)'), void 0);
    assert.deepStrictEqual(esEval('[4, 3, 2, 1].find(() => true)'), 4);
    assert.deepStrictEqual(esEval('[4, 3, 2, 1].find(x => x <= 2)'), 2);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4].find(x => x <= 2)'), 1);
  });
});
