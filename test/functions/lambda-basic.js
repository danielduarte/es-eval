const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Arrow functions', function () {

  it('lambda empty body', function () {
    assert.deepStrictEqual(esEval('() => {}').exec([]), void 0);
  });

  it('lambda literal expressions', function () {
    assert.deepStrictEqual(esEval('() => 1234').exec([]), 1234);
    assert.deepStrictEqual(esEval('() => undefined').exec([]), void 0);
    assert.deepStrictEqual(esEval('() => NaN').exec([]), NaN);
    assert.deepStrictEqual(esEval('() => Infinity').exec([]), Infinity);
    assert.deepStrictEqual(esEval('() => false').exec([]), false);
    assert.deepStrictEqual(esEval('() => true').exec([]), true);
    assert.deepStrictEqual(esEval('() => ""').exec([]), '');
    assert.deepStrictEqual(esEval('() => "abc"').exec([]), 'abc');
    assert.deepStrictEqual(esEval('() => ({})').exec([]), {});
    assert.deepStrictEqual(esEval('() => []').exec([]), []);
    assert.deepStrictEqual(esEval('() => null').exec([]), null);
  });

  it('lambdas expressions', function () {
    assert.deepStrictEqual(esEval('() => 1 + 8').exec([]), 9);
    assert.deepStrictEqual(esEval('() => (true && 0) || 47').exec([]), 47);
    assert.deepStrictEqual(esEval('() => undefined ?? 44').exec([]), 44);
    assert.deepStrictEqual(esEval('() => 1 ? 2 : 3').exec([]), 2);
    assert.deepStrictEqual(esEval('() => "0" ? "yes" : "no"').exec([]), 'yes');
    assert.deepStrictEqual(esEval('() => ({}) ? "yes" : "no"').exec([]), 'yes');
    assert.deepStrictEqual(esEval('() => [] ? "yes" : "no"').exec([]), 'yes');
  });

  it('lambdas parameters - identity function', function () {
    const identityFn = esEval('x => x');
    assert.deepStrictEqual(identityFn.exec([12345]), 12345);
    assert.deepStrictEqual(identityFn.exec([NaN]), NaN);
    assert.deepStrictEqual(identityFn.exec([Infinity]), Infinity);
    assert.deepStrictEqual(identityFn.exec([void 0]), void 0);
    assert.deepStrictEqual(identityFn.exec([]), void 0);
    assert.deepStrictEqual(identityFn.exec([false]), false);
    assert.deepStrictEqual(identityFn.exec([true]), true);
    assert.deepStrictEqual(identityFn.exec(['A']), 'A');
    assert.deepStrictEqual(identityFn.exec([{}]), {});
    assert.deepStrictEqual(identityFn.exec([[]]), []);
    assert.deepStrictEqual(identityFn.exec([null]), null);
  });

  it('lambdas parameters - many params', function () {
    const identityFn = esEval('(w, x, y, z) => w + x + y + z');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3, '4']), '1234');
    assert.deepStrictEqual(identityFn.exec([]), NaN);
  });

  it('lambdas IIFEs', function () {
    assert.deepStrictEqual(esEval('(() => {})()'), void 0);
    assert.deepStrictEqual(esEval('((x, y, z) => x + y + z)(11, 22, 33)'), 66);
    assert.deepStrictEqual(esEval('((x, y) => x + y)("this is ")'), 'this is undefined');
  });
});
