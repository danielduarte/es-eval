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

    // @todo implement variable qty of params
    // assert.deepStrictEqual(esEval('[].push(6, 5, 4, 3, 2, 1)'), 6);
    // assert.deepStrictEqual(esEval('(() => { const a = []; const added = a.push(5); return { a, added }; })()'), 1);
  });
});
