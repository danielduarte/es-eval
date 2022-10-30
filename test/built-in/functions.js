const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { assertError } = require('../utils');

describe('Built-in functions', function () {

  it('parseFloat', function () {
    assert.deepStrictEqual(esEval('typeof parseFloat'), 'function');
    // assert.deepStrictEqual(esEval('typeof this.parseFloat'), 'function'); // @todo: support this case
    assert.deepStrictEqual(esEval('typeof globalThis.parseFloat'), 'function');

    // Number
    assert.deepStrictEqual(esEval('parseFloat(0)'), 0);
    assert.deepStrictEqual(esEval('parseFloat(-0)'), 0);
    assert.deepStrictEqual(esEval('parseFloat(-12.34)'), -12.34);
    assert.deepStrictEqual(esEval('parseFloat(12.34)'), 12.34);
    assert.deepStrictEqual(esEval('parseFloat(NaN)'), NaN);
    assert.deepStrictEqual(esEval('parseFloat(Infinity)'), Infinity);
    assert.deepStrictEqual(esEval('parseFloat(-Infinity)'), -Infinity);

    // Undefined
    assert.deepStrictEqual(esEval('parseFloat()'), NaN);
    assert.deepStrictEqual(esEval('parseFloat(undefined)'), NaN);

    // Boolean
    assert.deepStrictEqual(esEval('parseFloat(false)'), NaN);
    assert.deepStrictEqual(esEval('parseFloat(true)'), NaN);

    // Object
    assert.deepStrictEqual(esEval('parseFloat(null)'), NaN);
    assert.deepStrictEqual(esEval('parseFloat({})'), NaN);
    assert.deepStrictEqual(esEval('parseFloat({ a: 1 })'), NaN);
    assert.deepStrictEqual(esEval('parseFloat({ "a": 1 })'), NaN);
    assert.deepStrictEqual(esEval('parseFloat({ ["a"]: 1 })'), NaN);
    // assert.deepStrictEqual(esEval('parseFloat({ toString: () => "12.34" })'), 12.34); // @todo(feat) support objects with toString

    // Array
    assert.deepStrictEqual(esEval('parseFloat([])'), NaN);
    assert.deepStrictEqual(esEval('parseFloat([12.34, 56.78])'), 12.34);
    assert.deepStrictEqual(esEval('parseFloat(["12.34", 56.78])'), 12.34);
    assert.deepStrictEqual(esEval('parseFloat(["12.34xyz", 56.78])'), 12.34);
    assert.deepStrictEqual(esEval('parseFloat([null, 12.34, 56.78])'), NaN);

    // String
    assert.deepStrictEqual(esEval('parseFloat("undefined")'), NaN);
    assert.deepStrictEqual(esEval('parseFloat("NaN")'), NaN);
    assert.deepStrictEqual(esEval('parseFloat("Infinity")'), Infinity);
    assert.deepStrictEqual(esEval('parseFloat("-Infinity")'), -Infinity);
    assert.deepStrictEqual(esEval('parseFloat("false")'), NaN);
    assert.deepStrictEqual(esEval('parseFloat("true")'), NaN);
    assert.deepStrictEqual(esEval('parseFloat("null")'), NaN);
    assert.deepStrictEqual(esEval('parseFloat("")'), NaN);
    assert.deepStrictEqual(esEval(`parseFloat("''")`), NaN);
    assert.deepStrictEqual(esEval(`parseFloat('""')`), NaN);
    assert.deepStrictEqual(esEval('parseFloat("any string")'), NaN);
    assert.deepStrictEqual(esEval('parseFloat("0")'), 0);
    assert.deepStrictEqual(esEval('parseFloat("-0")'), -0);
    assert.deepStrictEqual(esEval('parseFloat("-12.34")'), -12.34);
    assert.deepStrictEqual(esEval('parseFloat("12.34")'), 12.34);
    assert.deepStrictEqual(esEval('parseFloat("12.34x56")'), 12.34);
    assert.deepStrictEqual(esEval('parseFloat("   12.34   ")'), 12.34);
    assert.deepStrictEqual(esEval('parseFloat(() => "12.34")'), NaN);
  });

  it('parseInt', function () {
    assert.deepStrictEqual(esEval('typeof parseInt'), 'function');
    // assert.deepStrictEqual(esEval('typeof this.parseInt'), 'function'); // @todo: support this case
    assert.deepStrictEqual(esEval('typeof globalThis.parseInt'), 'function');

    // Number
    assert.deepStrictEqual(esEval('parseInt(0)'), 0);
    assert.deepStrictEqual(esEval('parseInt(-0)'), 0);
    assert.deepStrictEqual(esEval('parseInt(-12.89)'), -12);
    assert.deepStrictEqual(esEval('parseInt(12.89)'), 12);
    assert.deepStrictEqual(esEval('parseInt(NaN)'), NaN);
    assert.deepStrictEqual(esEval('parseInt(Infinity)'), NaN);
    assert.deepStrictEqual(esEval('parseInt(-Infinity)'), NaN);

    // Undefined
    assert.deepStrictEqual(esEval('parseInt()'), NaN);
    assert.deepStrictEqual(esEval('parseInt(undefined)'), NaN);

    // Boolean
    assert.deepStrictEqual(esEval('parseInt(false)'), NaN);
    assert.deepStrictEqual(esEval('parseInt(true)'), NaN);

    // Object
    assert.deepStrictEqual(esEval('parseInt(null)'), NaN);
    assert.deepStrictEqual(esEval('parseInt({})'), NaN);
    assert.deepStrictEqual(esEval('parseInt({ a: 1 })'), NaN);
    assert.deepStrictEqual(esEval('parseInt({ "a": 1 })'), NaN);
    assert.deepStrictEqual(esEval('parseInt({ ["a"]: 1 })'), NaN);
    // assert.deepStrictEqual(esEval('parseInt({ toString: () => "12.34" })'), 12.34); // @todo(feat) support objects with toString

    // Array
    assert.deepStrictEqual(esEval('parseInt([])'), NaN);
    assert.deepStrictEqual(esEval('parseInt([12.89, 56.78])'), 12);
    assert.deepStrictEqual(esEval('parseInt(["12.89", 56.78])'), 12);
    assert.deepStrictEqual(esEval('parseInt(["12.89xyz", 56.78])'), 12);
    assert.deepStrictEqual(esEval('parseInt([null, 12.89, 56.78])'), NaN);

    // String
    assert.deepStrictEqual(esEval('parseInt("undefined")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("NaN")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("Infinity")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("-Infinity")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("false")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("true")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("null")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("")'), NaN);
    assert.deepStrictEqual(esEval(`parseInt("''")`), NaN);
    assert.deepStrictEqual(esEval(`parseInt('""')`), NaN);
    assert.deepStrictEqual(esEval('parseInt("any string")'), NaN);
    assert.deepStrictEqual(esEval('parseInt("0")'), 0);
    assert.deepStrictEqual(esEval('parseInt("-0")'), -0);
    assert.deepStrictEqual(esEval('parseInt("-12.89")'), -12);
    assert.deepStrictEqual(esEval('parseInt("12.89")'), 12);
    assert.deepStrictEqual(esEval('parseInt("12.89x56")'), 12);
    assert.deepStrictEqual(esEval('parseInt("   12.89   ")'), 12);
    assert.deepStrictEqual(esEval('parseInt(() => "12.89")'), NaN);

    // @todo(test): add tests using radix
  });
});
