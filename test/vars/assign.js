const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Variable assignment in lambda expressions (let)', function () {

  it('lambda with assignment', function () {
    assert.deepStrictEqual(esEval('() => { let x; x = 5; return x; }').exec([], Context.EMPTY), 5);
    assert.deepStrictEqual(esEval('() => { let x = 5; x = 6; return x; }').exec([], Context.EMPTY), 6);
    assert.deepStrictEqual(esEval('() => { let x; x = 5; x = 8; return x; }').exec([], Context.EMPTY), 8);
    assert.deepStrictEqual(esEval('() => { let x; x = 6 + 1; return x; }').exec([], Context.EMPTY), 7);
    assert.deepStrictEqual(esEval('() => { let x, y; x = 5; y = 4; return x + y; }').exec([], Context.EMPTY), 9);
    assert.deepStrictEqual(esEval('() => { let x, y; x = y = 7; return x + y; }').exec([], Context.EMPTY), 14);
    assert.deepStrictEqual(esEval('() => { let x = 1, y = 2; x = y = 7; return x + y; }').exec([], Context.EMPTY), 14);
    assert.deepStrictEqual(esEval('() => { let x; return x = 5; }').exec([], Context.EMPTY), 5);
    assert.deepStrictEqual(esEval('() => { let x; return x = 6 + 1; }').exec([], Context.EMPTY), 7);
    assert.deepStrictEqual(esEval('() => { let x, y; return x = y = 7; }').exec([], Context.EMPTY), 7);
    assert.deepStrictEqual(esEval('() => { let x = 4, y = 8; return x = y; }').exec([], Context.EMPTY), 8);
    assert.deepStrictEqual(esEval('x => x = 2').exec([], Context.EMPTY), 2);
    assert.deepStrictEqual(esEval('x => x = 2').exec([3], Context.EMPTY), 2);
  });

  it('lambda with re-assigned constant', function () {
    let errMessage = 'NO ERROR';
    try {
      esEval('() => { const c = 1; c = 2; }').exec([], Context.EMPTY);
    } catch (err) {
      errMessage = err.message;
    }

    assert.deepStrictEqual(errMessage, `Cannot re-assign a constant: 'c'`);
  });
});
