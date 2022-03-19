const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { CONTEXT_EMPTY } = require('../../lib/context/defaults');

describe('Variable declaration in lambda expressions (let)', function () {

  it('lambda with let declaration', function () {
    assert.deepStrictEqual(esEval('() => { let c = 9; }').exec([], CONTEXT_EMPTY), void 0);
  });

  it('lambda with let declaration and return', function () {
    assert.deepStrictEqual(esEval('() => { let c; return c; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { let c = 9; return c; }').exec([], CONTEXT_EMPTY), 9);
    assert.deepStrictEqual(esEval('() => { let c = (1 + 4) ** 2; return c; }').exec([], CONTEXT_EMPTY), 25);
  });

  it('lambda with multiple let declaration', function () {
    assert.deepStrictEqual(esEval('e => { let c = 2, d = 4; return c + d + e; }').exec([10], CONTEXT_EMPTY), 16);
    assert.deepStrictEqual(esEval('e => { let c = 2; let d = 4; return c + d + e; }').exec([10], CONTEXT_EMPTY), 16);
  });
});
