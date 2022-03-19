const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');
const { CONTEXT_DEFAULT, CONTEXT_EMPTY } = require('../../lib/context/defaults');

describe('Constant declaration in lambda expressions (const)', function () {

  it('lambda with const declaration', function () {
    assert.deepStrictEqual(esEval('() => { const c = 9; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { const c = undefined; }').exec([], CONTEXT_DEFAULT), void 0); // @todo(test) test 'undefined' is not defined with EMPTY context
    assert.deepStrictEqual(esEval('() => { const c = NaN; }').exec([], CONTEXT_DEFAULT), void 0); // @todo(test) test 'NaN' is not defined with EMPTY context
    assert.deepStrictEqual(esEval('() => { const c = Infinity; }').exec([], CONTEXT_DEFAULT), void 0); // @todo(test) test 'Infinity' is not defined with EMPTY context
    assert.deepStrictEqual(esEval('() => { const c = false; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { const c = true; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { const c = null; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { const c = ""; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { const c = "a"; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { const c = { a: 1 }; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { const c = [1]; }').exec([], CONTEXT_EMPTY), void 0);
  });

  it('lambda with const declaration and return', function () {
    assert.deepStrictEqual(esEval('() => { const c = 9; return c; }').exec([], CONTEXT_EMPTY), 9);
    assert.deepStrictEqual(esEval('() => { const c = (1 + 4) ** 2; return c; }').exec([], CONTEXT_EMPTY), 25);
    assert.deepStrictEqual(esEval('() => { const c = { a: 1 }; return c; }').exec([], CONTEXT_EMPTY), { a: 1 });
  });

  it('lambda with multiple const declaration', function () {
    assert.deepStrictEqual(esEval('e => { const c = 2, d = 4; return c + d + e; }').exec([10], CONTEXT_EMPTY), 16);
    assert.deepStrictEqual(esEval('e => { const c = 2; const d = 4; return c + d + e; }').exec([10], CONTEXT_EMPTY), 16);
  });
});
