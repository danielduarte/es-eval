const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

// @todo(feat) add support for function declarations
// @todo(test) add recursion test

describe('Function expressions', function () {

  it('function empty body', function () {
    assert.deepStrictEqual(esEval('function () {}').exec([]), void 0);
  });

  it('function literal expressions', function () {
    assert.deepStrictEqual(esEval('function () { return 1234; }').exec([]), 1234);
    assert.deepStrictEqual(esEval('function () { return undefined; }').exec([]), void 0);
    assert.deepStrictEqual(esEval('function () { return NaN; }').exec([]), NaN);
    assert.deepStrictEqual(esEval('function () { return Infinity; }').exec([]), Infinity);
    assert.deepStrictEqual(esEval('function () { return false; }').exec([]), false);
    assert.deepStrictEqual(esEval('function () { return true; }').exec([]), true);
    assert.deepStrictEqual(esEval('function () { return ""; }').exec([]), '');
    assert.deepStrictEqual(esEval('function () { return "abc"; }').exec([]), 'abc');
    assert.deepStrictEqual(esEval('function () { return {}; }').exec([]), {});
    assert.deepStrictEqual(esEval('function () { return []; }').exec([]), []);
    assert.deepStrictEqual(esEval('function () { return null; }').exec([]), null);
  });

  it('function expressions', function () {
    assert.deepStrictEqual(esEval('function () { return 1 + 8; }').exec([]), 9);
    assert.deepStrictEqual(esEval('function () { return (true && 0) || 47; }').exec([]), 47);
    assert.deepStrictEqual(esEval('function () { return undefined ?? 44; }').exec([]), 44);
    assert.deepStrictEqual(esEval('function () { return 1 ? 2 : 3; }').exec([]), 2);
    assert.deepStrictEqual(esEval('function () { return "0" ? "yes" : "no"; }').exec([]), 'yes');
    assert.deepStrictEqual(esEval('function () { return {} ? "yes" : "no"; }').exec([]), 'yes');
    assert.deepStrictEqual(esEval('function () { return [] ? "yes" : "no"; }').exec([]), 'yes');
  });

  it('function parameters - identity function', function () {
    const identityFn = esEval('function (x) { return x; }');
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

  it('function parameters - many params', function () {
    const identityFn = esEval('function (w, x, y, z) { return w + x + y + z; }');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3, '4']), '1234');
    assert.deepStrictEqual(identityFn.exec([]), NaN);
  });

  it('function IIFEs', function () {
    assert.deepStrictEqual(esEval('(function () {})()'), void 0);
    assert.deepStrictEqual(esEval('(function (x, y, z) { return x + y + z; })(11, 22, 33)'), 66);
    assert.deepStrictEqual(esEval('(function (x, y) { return x + y; })("this is ")'), 'this is undefined');
  });
});
