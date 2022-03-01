const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Constant declaration in lambda expressions (const)', function () {

  it('lambda with const declaration', function () {
    assert.deepStrictEqual(esEval('() => { const c = 9; }').exec([], Context.EMPTY), void 0);
  });

  it('lambda with const declaration and return', function () {
    assert.deepStrictEqual(esEval('() => { const c = 9; return c; }').exec([], Context.EMPTY), 9);
    assert.deepStrictEqual(esEval('() => { const c = (1 + 4) ** 2; return c; }').exec([], Context.EMPTY), 25);
  });

  it('lambda with multiple const declaration', function () {
    assert.deepStrictEqual(esEval('e => { const c = 2, d = 4; return c + d + e; }').exec([10], Context.EMPTY), 16);
    assert.deepStrictEqual(esEval('e => { const c = 2; const d = 4; return c + d + e; }').exec([10], Context.EMPTY), 16);
  });
});
