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
    assert.deepStrictEqual(esEval('() => NaN').exec([], Context.DEFAULT), NaN);
    assert.deepStrictEqual(esEval('() => Infinity').exec([], Context.DEFAULT), Infinity);
    assert.deepStrictEqual(esEval('() => undefined').exec([], Context.DEFAULT), void 0);
    assert.deepStrictEqual(esEval('() => false').exec([], Context.EMPTY), false);
    assert.deepStrictEqual(esEval('() => true').exec([], Context.EMPTY), true);
    assert.deepStrictEqual(esEval('() => ""').exec([], Context.EMPTY), '');
    assert.deepStrictEqual(esEval('() => "abc"').exec([], Context.EMPTY), 'abc');
  });

  it('lambdas expressions', function () {
    assert.deepStrictEqual(esEval('() => 1 + 8').exec([], Context.EMPTY), 9);
    assert.deepStrictEqual(esEval('() => (true && 0) || 47').exec([], Context.EMPTY), 47);
    assert.deepStrictEqual(esEval('() => undefined ?? 44').exec([], Context.DEFAULT), 44);
    assert.deepStrictEqual(esEval('() => 1 ? 2 : 3').exec([], Context.EMPTY), 2);
    assert.deepStrictEqual(esEval('() => "0" ? "yes" : "no"').exec([], Context.EMPTY), 'yes');
  });

  it('lambdas parameters - identity function', function () {
    const identityFn = esEval('x => x');
    assert.deepStrictEqual(identityFn.exec([12345], Context.EMPTY), 12345);
    assert.deepStrictEqual(identityFn.exec([NaN], Context.EMPTY), NaN);
    assert.deepStrictEqual(identityFn.exec([Infinity], Context.EMPTY), Infinity);
    assert.deepStrictEqual(identityFn.exec([void 0], Context.EMPTY), void 0);
    assert.deepStrictEqual(identityFn.exec([], Context.EMPTY), void 0);
    assert.deepStrictEqual(identityFn.exec(['A'], Context.EMPTY), 'A');
    assert.deepStrictEqual(identityFn.exec([false], Context.EMPTY), false);
    assert.deepStrictEqual(identityFn.exec([true], Context.EMPTY), true);
  });

  it('lambdas parameters - many params', function () {
    const identityFn = esEval('(w, x, y, z) => w + x + y + z');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3, '4'], Context.EMPTY), '1234');
    assert.deepStrictEqual(identityFn.exec([], Context.EMPTY), NaN);
  });

  it('lambdas IIFEs', function () {
    assert.deepStrictEqual(esEval('(() => {})()'), void 0);
    assert.deepStrictEqual(esEval('((x, y, z) => x + y + z)(11, 22, 33)'), 66);
    assert.deepStrictEqual(esEval('((x, y) => x + y)("this is ")'), 'this is undefined');
  });
});
