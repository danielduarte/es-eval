const assert = require('assert');
const esEval = require('../..');

describe('Literals', function () {

  it('number', function () {
    assert.deepStrictEqual(esEval('1234'), 1234);
  });

  it('undefined', function () {
    assert.deepStrictEqual(esEval('undefined'), void 0);
  });

});
