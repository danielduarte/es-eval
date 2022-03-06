const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Built-in array features', function () {

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
    // @todo add tests running methods on values like null (ex: 'null.push(5)') or getting props like null.length
    assert.deepStrictEqual(esEval('[].push(5)'), 1);
    assert.deepStrictEqual(esEval('[undefined].push(5)'), 2);
    assert.deepStrictEqual(esEval('[].push(6, 5, 4, 3, 2, 1)'), 6);
    assert.deepStrictEqual(esEval('[8, 7].push(6, 5, 4, 3, 2, 1)'), 8);
    assert.deepStrictEqual(esEval('(() => { const a = [7, 6]; const count = a.push(5); return { array: a, count: count }; })()'), { array: [7, 6, 5], count: 3 });
    assert.deepStrictEqual(esEval('(() => { const a = []; a.push(null, undefined, NaN, Infinity); return a; })()'), [null, void 0, NaN, Infinity]);
  });
});
