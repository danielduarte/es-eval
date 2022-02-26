const assert = require('assert');
const esEval = require('..');

describe('Binary operations', function () {

  it('can add', function () {
    const code = '1 + 2';

    const actualResult = esEval(code);
    const expectedResult = 3;

    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('can subtract', function () {
    const code = '1 - 2';

    const actualResult = esEval(code);
    const expectedResult = -1;

    assert.deepStrictEqual(actualResult, expectedResult);
  });

});
