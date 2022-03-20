const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');
const { CONTEXT_DEFAULT, CONTEXT_EMPTY } = require('../../lib/context/defaults');

describe('Constant declaration in lambda expressions (const)', function () {

  it('lambda with const declaration', function () {
    assert.deepStrictEqual(esEval('() => { const c = 9; return c; }').exec([], CONTEXT_EMPTY), 9);
    assert.deepStrictEqual(esEval('() => { const c = undefined; return c; }').exec([], CONTEXT_DEFAULT), void 0);
    assert.deepStrictEqual(esEval('() => { const c = NaN; return c; }').exec([], CONTEXT_DEFAULT), NaN);
    assert.deepStrictEqual(esEval('() => { const c = Infinity; return c; }').exec([], CONTEXT_DEFAULT), Infinity);
    assert.deepStrictEqual(esEval('() => { const c = false; return c; }').exec([], CONTEXT_EMPTY), false);
    assert.deepStrictEqual(esEval('() => { const c = true; return c; }').exec([], CONTEXT_EMPTY), true);
    assert.deepStrictEqual(esEval('() => { const c = null; return c; }').exec([], CONTEXT_EMPTY), null);
    assert.deepStrictEqual(esEval('() => { const c = ""; return c; }').exec([], CONTEXT_EMPTY), '');
    assert.deepStrictEqual(esEval('() => { const c = "a"; return c; }').exec([], CONTEXT_EMPTY), 'a');
    assert.deepStrictEqual(esEval('() => { const c = { a: 1 }; return c; }').exec([], CONTEXT_EMPTY), { a: 1 });
    assert.deepStrictEqual(esEval('() => { const c = [1]; return c; }').exec([], CONTEXT_EMPTY), [1]);
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
