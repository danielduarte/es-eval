const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Spread syntax', function () {

  it('array spread', function () {
    assert.deepStrictEqual(esEval('[1, 2, ...[3, 4], 5]'), [1, 2, 3, 4, 5]);
  });

  it('object spread', function () {
    assert.deepStrictEqual(esEval('{a:1, b:2, ...{c:3, d:4}, e:5}'), { a: 1, b: 2, c: 3, d: 4, e: 5 });
    assert.deepStrictEqual(esEval('{a:1, b:2, ...{c:3, d:4, a: 9999}, e:5}'), { a: 9999, b: 2, c: 3, d: 4, e: 5 });
  });

  it('param spread', function () {
    assert.deepStrictEqual(esEval(`(() => {
      const a = [1, 2];
      a.push(...[3, 4, 5]);
      return a;
    })()`), [1, 2, 3, 4, 5]);
  });
});
