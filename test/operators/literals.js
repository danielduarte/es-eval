const assert = require('assert');
const esEval = require('../..');

describe('Literals', function () {

  it('number', function () {
    assert.deepStrictEqual(esEval('0'), 0);
    assert.deepStrictEqual(esEval('1234'), 1234);
  });

  it('undefined', function () {
    assert.deepStrictEqual(esEval('undefined'), void 0);
  });

  it('boolean', function () {
    assert.deepStrictEqual(esEval('false'), false);
    assert.deepStrictEqual(esEval('true'), true);
  });
});
