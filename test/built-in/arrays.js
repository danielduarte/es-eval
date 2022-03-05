const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Built-in array features', function () {

  it('length', function () {
    assert.deepStrictEqual(esEval('[].length'), 0);
    assert.deepStrictEqual(esEval('[6, 6, 6, 6].length'), 4);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4]; a.length = 8; return a.length; })()'), 8);
  });

  it('push', function () {
    assert.deepStrictEqual(esEval('[].push(5)'), 1);
    assert.deepStrictEqual(esEval('[undefined].push(5)'), 2);
    assert.deepStrictEqual(esEval('[].push(6, 5, 4, 3, 2, 1)'), 6);
    assert.deepStrictEqual(esEval('[8, 7].push(6, 5, 4, 3, 2, 1)'), 8);
    assert.deepStrictEqual(esEval('(() => { const a = [7, 6]; const count = a.push(5); return { array: a, count: count }; })()'), { array: [7, 6, 5], count: 3 });
  });
});
