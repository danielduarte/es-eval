const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Arrow functions - return statement', function () {

  it('lambda with code block - empty return only body', function () {
    assert.deepStrictEqual(esEval('() => { return; }').exec([], Context.EMPTY), void 0);
  });

  it('lambda with code block - return literal only body', function () {
    assert.deepStrictEqual(esEval('() => { return 1234; }').exec([], Context.EMPTY), 1234);
    assert.deepStrictEqual(esEval('() => { return undefined; }').exec([], Context.DEFAULT), void 0);
    assert.deepStrictEqual(esEval('() => { return false; }').exec([], Context.EMPTY), false);
    assert.deepStrictEqual(esEval('() => { return true; }').exec([], Context.EMPTY), true);
  });

  it('lambda with code block - multiple return', function () {
    assert.deepStrictEqual(esEval('() => { return 11; return 22; return 33 }').exec([], Context.EMPTY), 11);
  });

  it('lambda with code block - no return returns undefined', function () {
    assert.deepStrictEqual(esEval('() => { 5 }').exec([], Context.EMPTY), void 0);
  });
});
