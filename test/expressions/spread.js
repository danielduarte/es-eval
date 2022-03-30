const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { assertError } = require('../utils');

describe('Spread syntax', function () {

  it('array spread', function () {
    assert.deepStrictEqual(esEval('[1, 2, ...[3, 4], 5]'), [1, 2, 3, 4, 5]);
    assert.deepStrictEqual(esEval('(() => { const a = [3, 4]; return [1, 2, ...a, 5]; })()'), [1, 2, 3, 4, 5]);
    assert.deepStrictEqual(esEval('(() => { const a = () => [3, 4]; return [1, 2, ...a(), 5]; })()'), [1, 2, 3, 4, 5]);
    assertError(() => esEval('[1, 2, ...(x => x), 3]'), 'Value is not iterable');
    assertError(() => esEval('[1, 2, ...null, 3]'), 'Value is not iterable');
    assertError(() => esEval('[1, 2, ...undefined, 3]'), 'Value is not iterable');
  });

  it('object spread', function () {
    assert.deepStrictEqual(esEval('{a:1, b:2, ...{c:3, d:4}, e:5}'), { a: 1, b: 2, c: 3, d: 4, e: 5 });
    assert.deepStrictEqual(esEval('{a:1, b:2, ...{c:3, d:4, a: 9999}, e:5}'), { a: 9999, b: 2, c: 3, d: 4, e: 5 });
    assert.deepStrictEqual(esEval('(() => { const a = {c:3, d:4}; return {a:1, b:2, ...a, e:5}; })()'), { a: 1, b: 2, c: 3, d: 4, e: 5 });
    assert.deepStrictEqual(esEval('(() => { const a = () => ({c:3, d:4}); return {a:1, b:2, ...a(), e:5}; })()'), { a: 1, b: 2, c: 3, d: 4, e: 5 });
    assert.deepStrictEqual(esEval('{a:1, b:2, ...(x => x), c:3}'), { a: 1, b: 2, c: 3 });
    assert.deepStrictEqual(esEval('{a:1, b:2, ...null, c:3}'), { a: 1, b: 2, c: 3 });
    assert.deepStrictEqual(esEval('{a:1, b:2, ...undefined, c:3}'), { a: 1, b: 2, c: 3 });
  });

  it('param spread', function () {
    assert.deepStrictEqual(esEval(`(() => {
      const a = [1, 2];
      a.push(...[3, 4, 5, 6]);
      return a;
    })()`), [1, 2, 3, 4, 5, 6]);

    assert.deepStrictEqual(esEval(`(() => {
      const a = [1, 2];
      a.push(3, ...[4, 5], 6);
      return a;
    })()`), [1, 2, 3, 4, 5, 6]);
  });
});
