const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Arrow functions', function () {

  it('lambda empty body', function () {
    assert.deepStrictEqual(esEval('() => {}').exec([], Context.EMPTY), void 0);
  });

  it('lambda literal expressions', function () {
    assert.deepStrictEqual(esEval('() => 1234').exec([], Context.EMPTY), 1234);
    assert.deepStrictEqual(esEval('() => undefined').exec([], Context.DEFAULT), void 0);
    assert.deepStrictEqual(esEval('() => false').exec([], Context.EMPTY), false);
    assert.deepStrictEqual(esEval('() => true').exec([], Context.EMPTY), true);
  });

  it('lambdas expressions', function () {
    assert.deepStrictEqual(esEval('() => 1 + 8').exec([], Context.EMPTY), 9);
    assert.deepStrictEqual(esEval('() => (true && 0) || 47').exec([], Context.EMPTY), 47);
    assert.deepStrictEqual(esEval('() => undefined ?? 44').exec([], Context.DEFAULT), 44);
    assert.deepStrictEqual(esEval('() => 1 ? 2 : 3').exec([], Context.EMPTY), 2);
  });

  it('lambdas parameters - identity function', function () {
    const identityFn = esEval('x => x');
    assert.deepStrictEqual(identityFn.exec([12345], Context.EMPTY), 12345);
    assert.deepStrictEqual(identityFn.exec([], Context.EMPTY), undefined);
  });

  it('lambdas parameters - many params', function () {
    const identityFn = esEval('(x, y, z) => x + y + z');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3], Context.EMPTY), 123);
    assert.deepStrictEqual(identityFn.exec([], Context.EMPTY), NaN);
  });

  it('lambdas IIFEs', function () {
    assert.deepStrictEqual(esEval('(() => {})()'), void 0);
    assert.deepStrictEqual(esEval('((x, y, z) => x + y + z)(11, 22, 33)'), 66);
  });
});
