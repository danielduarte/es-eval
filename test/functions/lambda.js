const assert = require('assert');
const esEval = require('../..');

describe('Arrow functions', function () {

  it('lambda empty body', function () {
    assert.deepStrictEqual(esEval('() => {}').exec([]), void 0);
  });

  it('lambda literal expressions', function () {
    assert.deepStrictEqual(esEval('() => 1234').exec([]), 1234);
    assert.deepStrictEqual(esEval('() => undefined').exec([]), void 0);
    assert.deepStrictEqual(esEval('() => false').exec([]), false);
    assert.deepStrictEqual(esEval('() => true').exec([]), true);
  });

  it('lambdas expressions', function () {
    assert.deepStrictEqual(esEval('() => 1 + 8').exec([]), 9);
    assert.deepStrictEqual(esEval('() => (true && 0) || 47').exec([]), 47);
    assert.deepStrictEqual(esEval('() => undefined ?? 44').exec([]), 44);
    assert.deepStrictEqual(esEval('() => 1 ? 2 : 3').exec([]), 2);
  });

  it('lambdas parameters - identity function', function () {
    const identityFn = esEval('x => x');
    assert.deepStrictEqual(identityFn.exec([12345]), 12345);
    assert.deepStrictEqual(identityFn.exec([]), undefined);
  });

  it('lambdas parameters - many params', function () {
    const identityFn = esEval('(x, y, z) => x + y + z');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3]), 123);
    assert.deepStrictEqual(identityFn.exec([]), NaN);
  });

  it('lambdas IIFE', function () {
    assert.deepStrictEqual(esEval('(() => {})()'), void 0);
    assert.deepStrictEqual(esEval('((x, y, z) => x + y + z)(11, 22, 33)'), 66);
  });
});
