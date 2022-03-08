const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Function expressions', function () {

  it('function empty body', function () {
    assert.deepStrictEqual(esEval('function () {}').exec([], Context.EMPTY), void 0);
  });

  it('function literal expressions', function () {
    assert.deepStrictEqual(esEval('function () { return 1234; }').exec([], Context.EMPTY), 1234);
    assert.deepStrictEqual(esEval('function () { return undefined; }').exec([], Context.DEFAULT), void 0);
    assert.deepStrictEqual(esEval('function () { return NaN; }').exec([], Context.DEFAULT), NaN);
    assert.deepStrictEqual(esEval('function () { return Infinity; }').exec([], Context.DEFAULT), Infinity);
    assert.deepStrictEqual(esEval('function () { return false; }').exec([], Context.EMPTY), false);
    assert.deepStrictEqual(esEval('function () { return true; }').exec([], Context.EMPTY), true);
    assert.deepStrictEqual(esEval('function () { return ""; }').exec([], Context.EMPTY), '');
    assert.deepStrictEqual(esEval('function () { return "abc"; }').exec([], Context.EMPTY), 'abc');
    assert.deepStrictEqual(esEval('function () { return {}; }').exec([], Context.EMPTY), {});
    assert.deepStrictEqual(esEval('function () { return []; }').exec([], Context.EMPTY), []);
    assert.deepStrictEqual(esEval('function () { return null; }').exec([], Context.EMPTY), null);
  });

  it('function expressions', function () {
    assert.deepStrictEqual(esEval('function () { return 1 + 8; }').exec([], Context.EMPTY), 9);
    assert.deepStrictEqual(esEval('function () { return (true && 0) || 47; }').exec([], Context.EMPTY), 47);
    assert.deepStrictEqual(esEval('function () { return undefined ?? 44; }').exec([], Context.DEFAULT), 44);
    assert.deepStrictEqual(esEval('function () { return 1 ? 2 : 3; }').exec([], Context.EMPTY), 2);
    assert.deepStrictEqual(esEval('function () { return "0" ? "yes" : "no"; }').exec([], Context.EMPTY), 'yes');
    assert.deepStrictEqual(esEval('function () { return {} ? "yes" : "no"; }').exec([], Context.EMPTY), 'yes');
    assert.deepStrictEqual(esEval('function () { return [] ? "yes" : "no"; }').exec([], Context.EMPTY), 'yes');
  });

  it('function parameters - identity function', function () {
    const identityFn = esEval('function (x) { return x; }');
    assert.deepStrictEqual(identityFn.exec([12345], Context.EMPTY), 12345);
    assert.deepStrictEqual(identityFn.exec([NaN], Context.EMPTY), NaN);
    assert.deepStrictEqual(identityFn.exec([Infinity], Context.EMPTY), Infinity);
    assert.deepStrictEqual(identityFn.exec([void 0], Context.EMPTY), void 0);
    assert.deepStrictEqual(identityFn.exec([], Context.EMPTY), void 0);
    assert.deepStrictEqual(identityFn.exec([false], Context.EMPTY), false);
    assert.deepStrictEqual(identityFn.exec([true], Context.EMPTY), true);
    assert.deepStrictEqual(identityFn.exec(['A'], Context.EMPTY), 'A');
    assert.deepStrictEqual(identityFn.exec([{}], Context.EMPTY), {});
    assert.deepStrictEqual(identityFn.exec([[]], Context.EMPTY), []);
    assert.deepStrictEqual(identityFn.exec([null], Context.EMPTY), null);
  });

  it('function parameters - many params', function () {
    const identityFn = esEval('function (w, x, y, z) { return w + x + y + z; }');
    assert.deepStrictEqual(identityFn.exec([100, 20, 3, '4'], Context.EMPTY), '1234');
    assert.deepStrictEqual(identityFn.exec([], Context.EMPTY), NaN);
  });

  it('function IIFEs', function () {
    assert.deepStrictEqual(esEval('(function () {})()'), void 0);
    assert.deepStrictEqual(esEval('(function (x, y, z) { return x + y + z; })(11, 22, 33)'), 66);
    assert.deepStrictEqual(esEval('(function (x, y) { return x + y; })("this is ")'), 'this is undefined');
  });
});
