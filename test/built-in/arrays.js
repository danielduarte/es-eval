const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { assertError } = require('../utils');

describe('Arrays', function () {

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
    assert.deepStrictEqual(esEval('[].length'), 0);
    assert.deepStrictEqual(esEval('[6, 6, 6, 6].length'), 4);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4]; a.length = 8; return a.length; })()'), 8);
  });

  it('push', function () {
    // Basic behavior
    assert.deepStrictEqual(esEval('[].push(5)'), 1);
    assert.deepStrictEqual(esEval('[undefined].push(5)'), 2);
    assert.deepStrictEqual(esEval('[].push(6, 5, 4, 3, 2, 1)'), 6);
    assert.deepStrictEqual(esEval('[8, 7].push(6, 5, 4, 3, 2, 1)'), 8);
    assert.deepStrictEqual(esEval('(() => { const a = [7, 6]; const count = a.push(5); return { array: a, count: count }; })()'), { array: [7, 6, 5], count: 3 });
    assert.deepStrictEqual(esEval('(() => { const a = []; a.push(null, undefined, NaN, Infinity); return a; })()'), [null, void 0, NaN, Infinity]);
  });

  it('map', function () {
    // @todo(test) add tests for the thisArg parameter when supported (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    assert.deepStrictEqual(esEval('[].map(x => x)'), []);
    assert.deepStrictEqual(esEval('[3, 4, 5].map(x => x)'), [3, 4, 5]);
    assert.deepStrictEqual(esEval('[3, 4, 5].map(x => 2 * x)'), [6, 8, 10]);
    assert.deepStrictEqual(esEval('(() => { const a = [2, 4, 6]; const b = a.map(x => x / 2); return { a: a, b: b }; })()'), { a: [2, 4, 6], b: [1, 2, 3] });
    assert.deepStrictEqual(esEval('(() => { const fn = x => "[" + x + "]"; return [[1, 2, 3].map(fn), [undefined, "a", "b"].map(fn)]; })()'), [["[1]", "[2]", "[3]"], ["[undefined]", "[a]", "[b]"]]);
  });

  it('reduce', function () {
    assert.deepStrictEqual(esEval('[1, 2, 3, 4].reduce((acc, elem) => acc + elem, 1000)'), 1000 + 1 + 2 + 3 + 4);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4].reduce((acc, elem) => acc + elem)'), 1 + 2 + 3 + 4);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4].reduce((acc, elem) => acc + elem, undefined)'), NaN);
    assert.deepStrictEqual(esEval('["A", "B", "C"].reduce((acc, elem, ix) => { acc.push(elem + " at " + ix); return acc; }, [])'), ['A at 0', 'B at 1', 'C at 2']);
    assert.deepStrictEqual(esEval('["A", "B", "C"].reduce((acc, elem, i, array) => { if (i === 1) array.push("?"); acc.push(array.length); return acc; }, [])'), [3, 4, 4]);
  });

  it('includes', function () {
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].includes(3)'), true);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].includes(3, 2)'), true);
    assert.deepStrictEqual(esEval('[1, 2, 3, 4, 5].includes(3, 3)'), false);
    assert.deepStrictEqual(esEval('[{ a: 1 }].includes({ a: 1 })'), false);
    assert.deepStrictEqual(esEval('(() => { const o = { a: 1 }; return [o].includes(o); })()'), true);
    assert.deepStrictEqual(esEval('[function () {}].includes(function () {})'), false);
    assert.deepStrictEqual(esEval('(() => { const fn = function () {}; return [fn].includes(fn); })()'), true);
  });

  it('filter', function () {
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
});
