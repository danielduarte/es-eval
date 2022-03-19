const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { CONTEXT_DEFAULT, CONTEXT_EMPTY } = require('../../lib/context/defaults');

describe('Arrow functions', function () {

  it('lambda empty body', function () {
    assert.deepStrictEqual(esEval('() => {}').exec([], CONTEXT_EMPTY), void 0);
  });

  it('lambda literal expressions', function () {
    assert.deepStrictEqual(esEval('() => 1234').exec([], CONTEXT_EMPTY), 1234);
    assert.deepStrictEqual(esEval('() => undefined').exec([], CONTEXT_DEFAULT), void 0);
    assert.deepStrictEqual(esEval('() => NaN').exec([], CONTEXT_DEFAULT), NaN);
    assert.deepStrictEqual(esEval('() => Infinity').exec([], CONTEXT_DEFAULT), Infinity);
    assert.deepStrictEqual(esEval('() => false').exec([], CONTEXT_EMPTY), false);
    assert.deepStrictEqual(esEval('() => true').exec([], CONTEXT_EMPTY), true);
    assert.deepStrictEqual(esEval('() => ""').exec([], CONTEXT_EMPTY), '');
    assert.deepStrictEqual(esEval('() => "abc"').exec([], CONTEXT_EMPTY), 'abc');
    assert.deepStrictEqual(esEval('() => ({})').exec([], CONTEXT_EMPTY), {});
    assert.deepStrictEqual(esEval('() => []').exec([], CONTEXT_EMPTY), []);
    assert.deepStrictEqual(esEval('() => null').exec([], CONTEXT_EMPTY), null);
  });

  it('lambdas expressions', function () {
    assert.deepStrictEqual(esEval('() => 1 + 8').exec([], CONTEXT_EMPTY), 9);
    assert.deepStrictEqual(esEval('() => (true && 0) || 47').exec([], CONTEXT_EMPTY), 47);
    assert.deepStrictEqual(esEval('() => undefined ?? 44').exec([], CONTEXT_DEFAULT), 44);
    assert.deepStrictEqual(esEval('() => 1 ? 2 : 3').exec([], CONTEXT_EMPTY), 2);
    assert.deepStrictEqual(esEval('() => "0" ? "yes" : "no"').exec([], CONTEXT_EMPTY), 'yes');
    assert.deepStrictEqual(esEval('() => ({}) ? "yes" : "no"').exec([], CONTEXT_EMPTY), 'yes');
    assert.deepStrictEqual(esEval('() => [] ? "yes" : "no"').exec([], CONTEXT_EMPTY), 'yes');
  });

  it('lambdas parameters - identity function', function () {
    const identityFn = esEval('x => x');
    assert.deepStrictEqual(identityFn.exec([12345], CONTEXT_EMPTY), 12345);
    assert.deepStrictEqual(identityFn.exec([NaN], CONTEXT_EMPTY), NaN);
    assert.deepStrictEqual(identityFn.exec([Infinity], CONTEXT_EMPTY), Infinity);
    assert.deepStrictEqual(identityFn.exec([void 0], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(identityFn.exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(identityFn.exec([false], CONTEXT_EMPTY), false);
    assert.deepStrictEqual(identityFn.exec([true], CONTEXT_EMPTY), true);
    assert.deepStrictEqual(identityFn.exec(['A'], CONTEXT_EMPTY), 'A');
    assert.deepStrictEqual(identityFn.exec([{}], CONTEXT_EMPTY), {});
    assert.deepStrictEqual(identityFn.exec([[]], CONTEXT_EMPTY), []);
    assert.deepStrictEqual(identityFn.exec([null], CONTEXT_EMPTY), null);
  });

  it('lambdas parameters - many params', function () {
    const identityFn = esEval('(w, x, y, z) => w + x + y + z');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3, '4'], CONTEXT_EMPTY), '1234');
    assert.deepStrictEqual(identityFn.exec([], CONTEXT_EMPTY), NaN);
  });

  it('lambdas IIFEs', function () {
    assert.deepStrictEqual(esEval('(() => {})()'), void 0);
    assert.deepStrictEqual(esEval('((x, y, z) => x + y + z)(11, 22, 33)'), 66);
    assert.deepStrictEqual(esEval('((x, y) => x + y)("this is ")'), 'this is undefined');
  });
});
