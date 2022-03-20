const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { CONTEXT_DEFAULT, CONTEXT_EMPTY } = require('../../lib/context/defaults');

// @todo(feat) add support for function declarations
// @todo(test) add recursion test

describe('Function expressions', function () {

  it('function empty body', function () {
    assert.deepStrictEqual(esEval('function () {}').exec([], CONTEXT_EMPTY), void 0);
  });

  it('function literal expressions', function () {
    assert.deepStrictEqual(esEval('function () { return 1234; }').exec([], CONTEXT_EMPTY), 1234);
    assert.deepStrictEqual(esEval('function () { return undefined; }').exec([], CONTEXT_DEFAULT), void 0);
    assert.deepStrictEqual(esEval('function () { return NaN; }').exec([], CONTEXT_DEFAULT), NaN);
    assert.deepStrictEqual(esEval('function () { return Infinity; }').exec([], CONTEXT_DEFAULT), Infinity);
    assert.deepStrictEqual(esEval('function () { return false; }').exec([], CONTEXT_EMPTY), false);
    assert.deepStrictEqual(esEval('function () { return true; }').exec([], CONTEXT_EMPTY), true);
    assert.deepStrictEqual(esEval('function () { return ""; }').exec([], CONTEXT_EMPTY), '');
    assert.deepStrictEqual(esEval('function () { return "abc"; }').exec([], CONTEXT_EMPTY), 'abc');
    assert.deepStrictEqual(esEval('function () { return {}; }').exec([], CONTEXT_EMPTY), {});
    assert.deepStrictEqual(esEval('function () { return []; }').exec([], CONTEXT_EMPTY), []);
    assert.deepStrictEqual(esEval('function () { return null; }').exec([], CONTEXT_EMPTY), null);
  });

  it('function expressions', function () {
    assert.deepStrictEqual(esEval('function () { return 1 + 8; }').exec([], CONTEXT_EMPTY), 9);
    assert.deepStrictEqual(esEval('function () { return (true && 0) || 47; }').exec([], CONTEXT_EMPTY), 47);
    assert.deepStrictEqual(esEval('function () { return undefined ?? 44; }').exec([], CONTEXT_DEFAULT), 44);
    assert.deepStrictEqual(esEval('function () { return 1 ? 2 : 3; }').exec([], CONTEXT_EMPTY), 2);
    assert.deepStrictEqual(esEval('function () { return "0" ? "yes" : "no"; }').exec([], CONTEXT_EMPTY), 'yes');
    assert.deepStrictEqual(esEval('function () { return {} ? "yes" : "no"; }').exec([], CONTEXT_EMPTY), 'yes');
    assert.deepStrictEqual(esEval('function () { return [] ? "yes" : "no"; }').exec([], CONTEXT_EMPTY), 'yes');
  });

  it('function parameters - identity function', function () {
    const identityFn = esEval('function (x) { return x; }');
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

  it('function parameters - many params', function () {
    const identityFn = esEval('function (w, x, y, z) { return w + x + y + z; }');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3, '4'], CONTEXT_EMPTY), '1234');
    assert.deepStrictEqual(identityFn.exec([], CONTEXT_EMPTY), NaN);
  });

  it('function IIFEs', function () {
    assert.deepStrictEqual(esEval('(function () {})()'), void 0);
    assert.deepStrictEqual(esEval('(function (x, y, z) { return x + y + z; })(11, 22, 33)'), 66);
    assert.deepStrictEqual(esEval('(function (x, y) { return x + y; })("this is ")'), 'this is undefined');
  });
});
