const assert = require('assert');
const esEval = require('../..');

describe('Nested expressions', function () {

  it('single 1 level', function () {
    assert.deepStrictEqual(esEval('(6)'), 6);
    assert.deepStrictEqual(esEval('(undefined)'), void 0);
    assert.deepStrictEqual(esEval('(true)'), true);
    assert.deepStrictEqual(esEval('(false)'), false);
  });

  it('single multi level', function () {
    assert.deepStrictEqual(esEval('(((((6)))))'), 6);
    assert.deepStrictEqual(esEval('(((((undefined)))))'), void 0);
    assert.deepStrictEqual(esEval('(((((true)))))'), true);
    assert.deepStrictEqual(esEval('(((((false)))))'), false);  });

  it('associative', function () {
    assert.deepStrictEqual(esEval('1 - 2 - 3'), -4);
    assert.deepStrictEqual(esEval('(1 - 2) - 3'), -4);
    assert.deepStrictEqual(esEval('1 - (2 - 3)'), 2);
  });
});
