const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Arrow functions - return statement', function () {

  it('function - empty statement', function () {
    assert.deepStrictEqual(esEval('function () { ; }').exec([], Context.EMPTY), void 0);
    assert.deepStrictEqual(esEval('function () { ;;;; }').exec([], Context.EMPTY), void 0);
  });

  it('function - empty return only body', function () {
    assert.deepStrictEqual(esEval('function () { return; }').exec([], Context.EMPTY), void 0);
  });

  it('function - multiple return', function () {
    assert.deepStrictEqual(esEval('function () { return 11; return 22; return 33; }').exec([], Context.EMPTY), 11);
  });

  it('function - no return returns undefined', function () {
    assert.deepStrictEqual(esEval('function () { 5 }').exec([], Context.EMPTY), void 0);
  });
});
