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

  it('can multiply', function () {
    const code = '3 * 4';

    const actualResult = esEval(code);
    const expectedResult = 12;

    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('can divide', function () {
    const code = '3 / 4';

    const actualResult = esEval(code);
    const expectedResult = 0.75;

    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('can calculate modulus', function () {
    const code = '10 % 3';

    const actualResult = esEval(code);
    const expectedResult = 1;

    assert.deepStrictEqual(actualResult, expectedResult);
  });

});
