const assert = require('assert');
const esEval = require('../..');

// @todo check Infinity and NaN are not overridden (they are valid identifiers, the same as 'undefined')

describe('Literals', function () {

  it('number', function () {
    assert.deepStrictEqual(esEval('0'), 0);
    assert.deepStrictEqual(esEval('1234'), 1234);
    assert.deepStrictEqual(esEval('Infinity'), Infinity);
    assert.deepStrictEqual(esEval('NaN'), NaN);
  });

  it('undefined', function () {
    assert.deepStrictEqual(esEval('undefined'), void 0);
  });

  it('boolean', function () {
    assert.deepStrictEqual(esEval('false'), false);
    assert.deepStrictEqual(esEval('true'), true);
  });
});
