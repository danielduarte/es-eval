const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

// @todo add tests for other type (non numeric)
describe('Built-in Math object', function () {

  it('Math object exists and is valid', function () {
    assert.deepStrictEqual(esEval('typeof Math'), 'object');
  });

  it('Math.random', function () {
    assert.deepStrictEqual(esEval('typeof Math.random'), 'function');

    let prevRnd = null;
    for (let i = 0; i < 10; i++) {
      const rnd = esEval('Math.random()');
      assert.deepStrictEqual(rnd >= 0, true);
      assert.deepStrictEqual(rnd < 1, true);
      assert.deepStrictEqual(prevRnd !== rnd, true);
      prevRnd = rnd;
    }
  });

  it('Math.floor', function () {
    assert.deepStrictEqual(esEval('typeof Math.floor'), 'function');

    assert.deepStrictEqual(esEval('Math.floor(12)'), 12);
    assert.deepStrictEqual(esEval('Math.floor(12.1111)'), 12);
    assert.deepStrictEqual(esEval('Math.floor(12.5)'), 12);
    assert.deepStrictEqual(esEval('Math.floor(12.6666)'), 12);
  });

  it('Math.ceil', function () {
    assert.deepStrictEqual(esEval('typeof Math.ceil'), 'function');

    assert.deepStrictEqual(esEval('Math.ceil(12)'), 12);
    assert.deepStrictEqual(esEval('Math.ceil(12.1111)'), 13);
    assert.deepStrictEqual(esEval('Math.ceil(12.5)'), 13);
    assert.deepStrictEqual(esEval('Math.ceil(12.6666)'), 13);
  });

  it('Math.round', function () {
    assert.deepStrictEqual(esEval('typeof Math.round'), 'function');

    assert.deepStrictEqual(esEval('Math.round(12)'), 12);
    assert.deepStrictEqual(esEval('Math.round(12.1111)'), 12);
    assert.deepStrictEqual(esEval('Math.round(12.5)'), 13);
    assert.deepStrictEqual(esEval('Math.round(12.6666)'), 13);
  });

  it('Math.min', function () {
    assert.deepStrictEqual(esEval('typeof Math.min'), 'function');

    assert.deepStrictEqual(esEval('Math.min(5, 7, 2, 9)'), 2);
    assert.deepStrictEqual(esEval('Math.min()'), Infinity);
  });

  it('Math.max', function () {
    assert.deepStrictEqual(esEval('typeof Math.max'), 'function');

    assert.deepStrictEqual(esEval('Math.max(5, 7, 2, 3)'), 7);
    assert.deepStrictEqual(esEval('Math.max()'), -Infinity);
  });
});
