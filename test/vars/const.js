const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Constant declaration in lambda expressions (const)', function () {

  it('lambda with const declaration', function () {
    assert.deepStrictEqual(esEval('() => { const c = 9; return c; }').exec([]), 9);
    assert.deepStrictEqual(esEval('() => { const c = undefined; return c; }').exec([]), void 0);
    assert.deepStrictEqual(esEval('() => { const c = NaN; return c; }').exec([]), NaN);
    assert.deepStrictEqual(esEval('() => { const c = Infinity; return c; }').exec([]), Infinity);
    assert.deepStrictEqual(esEval('() => { const c = false; return c; }').exec([]), false);
    assert.deepStrictEqual(esEval('() => { const c = true; return c; }').exec([]), true);
    assert.deepStrictEqual(esEval('() => { const c = null; return c; }').exec([]), null);
    assert.deepStrictEqual(esEval('() => { const c = ""; return c; }').exec([]), '');
    assert.deepStrictEqual(esEval('() => { const c = "a"; return c; }').exec([]), 'a');
    assert.deepStrictEqual(esEval('() => { const c = { a: 1 }; return c; }').exec([]), { a: 1 });
    assert.deepStrictEqual(esEval('() => { const c = [1]; return c; }').exec([]), [1]);
  });

  it('lambda with const declaration and return', function () {
    assert.deepStrictEqual(esEval('() => { const c = 9; return c; }').exec([]), 9);
    assert.deepStrictEqual(esEval('() => { const c = (1 + 4) ** 2; return c; }').exec([]), 25);
    assert.deepStrictEqual(esEval('() => { const c = { a: 1 }; return c; }').exec([]), { a: 1 });
  });

  it('lambda with multiple const declaration', function () {
    assert.deepStrictEqual(esEval('e => { const c = 2, d = 4; return c + d + e; }').exec([10]), 16);
    assert.deepStrictEqual(esEval('e => { const c = 2; const d = 4; return c + d + e; }').exec([10]), 16);
  });
});
