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

  it('isFinite', function () {
    assert.deepStrictEqual(esEval('typeof isFinite'), 'function');
    // assert.deepStrictEqual(esEval('typeof this.isFinite'), 'function'); // @todo: support this case
    assert.deepStrictEqual(esEval('typeof globalThis.isFinite'), 'function');

    // Number
    assert.deepStrictEqual(esEval('isFinite(0)'), true);
    assert.deepStrictEqual(esEval('isFinite(-0)'), true);
    assert.deepStrictEqual(esEval('isFinite(-12.89)'), true);
    assert.deepStrictEqual(esEval('isFinite(12.89)'), true);
    assert.deepStrictEqual(esEval('isFinite(NaN)'), false);
    assert.deepStrictEqual(esEval('isFinite(Infinity)'), false);
    assert.deepStrictEqual(esEval('isFinite(-Infinity)'), false);

    // Undefined
    assert.deepStrictEqual(esEval('isFinite()'), false);
    assert.deepStrictEqual(esEval('isFinite(undefined)'), false);

    // Boolean
    assert.deepStrictEqual(esEval('isFinite(false)'), true);
    assert.deepStrictEqual(esEval('isFinite(true)'), true);

    // Object
    assert.deepStrictEqual(esEval('isFinite(null)'), true);
    assert.deepStrictEqual(esEval('isFinite({})'), false);
    assert.deepStrictEqual(esEval('isFinite({ a: 1 })'), false);
    assert.deepStrictEqual(esEval('isFinite({ "a": 1 })'), false);
    assert.deepStrictEqual(esEval('isFinite({ ["a"]: 1 })'), false);
    // assert.deepStrictEqual(esEval('isFinite({ toString: () => 123 })'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isFinite({ toString: () => "123"})'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isisFiniteNaN({ toString: () => "abc"})'), true); // @todo support this case

    // Array
    assert.deepStrictEqual(esEval('isFinite([])'), true);
    assert.deepStrictEqual(esEval('isFinite([""])'), true);
    assert.deepStrictEqual(esEval('isFinite(["", 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([false])'), false);
    assert.deepStrictEqual(esEval('isFinite([false, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([true])'), false);
    assert.deepStrictEqual(esEval('isFinite([true, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([NaN])'), false);
    assert.deepStrictEqual(esEval('isFinite([NaN, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([Infinity])'), false);
    assert.deepStrictEqual(esEval('isFinite([Infinity, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([-Infinity])'), false);
    assert.deepStrictEqual(esEval('isFinite([-Infinity, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([undefined])'), true);
    assert.deepStrictEqual(esEval('isFinite([undefined, 56.78])'), false);

    assert.deepStrictEqual(esEval('isFinite([12.89])'), true);
    assert.deepStrictEqual(esEval('isFinite([12.89, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite(["12.89"])'), true);
    assert.deepStrictEqual(esEval('isFinite(["12.89", 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([" 12.89xyz"])'), false);
    assert.deepStrictEqual(esEval('isFinite([" 12.89xyz", 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([null])'), true);
    assert.deepStrictEqual(esEval('isFinite([null, 12.89, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([{}])'), false);
    assert.deepStrictEqual(esEval('isFinite([{}, 12.89, 56.78])'), false);
    assert.deepStrictEqual(esEval('isFinite([{ a: 1 }])'), false);
    assert.deepStrictEqual(esEval('isFinite([{ a: 1 }, 12.89, 56.78])'), false);
    // assert.deepStrictEqual(esEval('isFinite([{ toString: () => 123}])'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isFinite([{ toString: () => "123"}])'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isFinite([{ toString: () => "abc"}])'), true); // @todo support this case
    assert.deepStrictEqual(esEval('isFinite([[[[]]]])'), true);
    assert.deepStrictEqual(esEval('isFinite([[[[33]]]])'), true);
    assert.deepStrictEqual(esEval('isFinite([[[[33, 1]]]])'), false);
    assert.deepStrictEqual(esEval('isFinite([[[[33]], 1]])'), false);
    assert.deepStrictEqual(esEval('isFinite([[[[33]]], 1])'), false);
    assert.deepStrictEqual(esEval('isFinite([[[[NaN]]]])'), false);
    assert.deepStrictEqual(esEval('isFinite([[[["123"]]]])'), true);
    assert.deepStrictEqual(esEval('isFinite([[[["str"]]]])'), false);

    // String
    assert.deepStrictEqual(esEval('isFinite("undefined")'), false);
    assert.deepStrictEqual(esEval('isFinite("NaN")'), false);
    assert.deepStrictEqual(esEval('isFinite("Infinity")'), false);
    assert.deepStrictEqual(esEval('isFinite("-Infinity")'), false);
    assert.deepStrictEqual(esEval('isFinite("false")'), false);
    assert.deepStrictEqual(esEval('isFinite("true")'), false);
    assert.deepStrictEqual(esEval('isFinite("null")'), false);
    assert.deepStrictEqual(esEval('isFinite("")'), true);
    assert.deepStrictEqual(esEval(`isFinite("''")`), false);
    assert.deepStrictEqual(esEval(`isFinite('""')`), false);
    assert.deepStrictEqual(esEval('isFinite("any string")'), false);
    assert.deepStrictEqual(esEval('isFinite("0")'), true);
    assert.deepStrictEqual(esEval('isFinite("-0")'), true);
    assert.deepStrictEqual(esEval('isFinite("-12.89")'), true);
    assert.deepStrictEqual(esEval('isFinite("12.89")'), true);
    assert.deepStrictEqual(esEval('isFinite("12.89x56")'), false);
    assert.deepStrictEqual(esEval('isFinite("   12.89   ")'), true);
    assert.deepStrictEqual(esEval('isFinite(() => "12.89")'), false);
  });

  it('isNaN', function () {
    assert.deepStrictEqual(esEval('typeof isNaN'), 'function');
    // // assert.deepStrictEqual(esEval('typeof this.isNaN'), 'function'); // @todo: support this case
    assert.deepStrictEqual(esEval('typeof globalThis.isNaN'), 'function');

    // Number
    assert.deepStrictEqual(esEval('isNaN(0)'), false);
    assert.deepStrictEqual(esEval('isNaN(-0)'), false);
    assert.deepStrictEqual(esEval('isNaN(-12.89)'), false);
    assert.deepStrictEqual(esEval('isNaN(12.89)'), false);
    assert.deepStrictEqual(esEval('isNaN(NaN)'), true);
    assert.deepStrictEqual(esEval('isNaN(Infinity)'), false);
    assert.deepStrictEqual(esEval('isNaN(-Infinity)'), false);

    // Undefined
    assert.deepStrictEqual(esEval('isNaN()'), true);
    assert.deepStrictEqual(esEval('isNaN(undefined)'), true);

    // Boolean
    assert.deepStrictEqual(esEval('isNaN(false)'), false);
    assert.deepStrictEqual(esEval('isNaN(true)'), false);

    // Object
    assert.deepStrictEqual(esEval('isNaN(null)'), false);
    assert.deepStrictEqual(esEval('isNaN({})'), true);
    assert.deepStrictEqual(esEval('isNaN({ a: 1 })'), true);
    assert.deepStrictEqual(esEval('isNaN({ "a": 1 })'), true);
    assert.deepStrictEqual(esEval('isNaN({ ["a"]: 1 })'), true);
    // assert.deepStrictEqual(esEval('isNaN({ toString: () => 123 })'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isNaN({ toString: () => "123"})'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isNaN({ toString: () => "abc"})'), true); // @todo support this case

    // Array
    assert.deepStrictEqual(esEval('isNaN([])'), false);
    assert.deepStrictEqual(esEval('isNaN([""])'), false);
    assert.deepStrictEqual(esEval('isNaN(["", 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([false])'), true);
    assert.deepStrictEqual(esEval('isNaN([false, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([true])'), true);
    assert.deepStrictEqual(esEval('isNaN([true, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([NaN])'), true);
    assert.deepStrictEqual(esEval('isNaN([NaN, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([Infinity])'), false);
    assert.deepStrictEqual(esEval('isNaN([Infinity, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([-Infinity])'), false);
    assert.deepStrictEqual(esEval('isNaN([-Infinity, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([undefined])'), false);
    assert.deepStrictEqual(esEval('isNaN([undefined, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([12.89])'), false);
    assert.deepStrictEqual(esEval('isNaN([12.89, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN(["12.89"])'), false);
    assert.deepStrictEqual(esEval('isNaN(["12.89", 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([" 12.89xyz"])'), true);
    assert.deepStrictEqual(esEval('isNaN([" 12.89xyz", 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([null])'), false);
    assert.deepStrictEqual(esEval('isNaN([null, 12.89, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([{}])'), true);
    assert.deepStrictEqual(esEval('isNaN([{}, 12.89, 56.78])'), true);
    assert.deepStrictEqual(esEval('isNaN([{ a: 1 }])'), true);
    assert.deepStrictEqual(esEval('isNaN([{ a: 1 }, 12.89, 56.78])'), true);
    // assert.deepStrictEqual(esEval('isNaN([{ toString: () => 123}])'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isNaN([{ toString: () => "123"}])'), false); // @todo support this case
    // assert.deepStrictEqual(esEval('isNaN([{ toString: () => "abc"}])'), true); // @todo support this case
    assert.deepStrictEqual(esEval('isNaN([[[[]]]])'), false);
    assert.deepStrictEqual(esEval('isNaN([[[[33]]]])'), false);
    assert.deepStrictEqual(esEval('isNaN([[[[33, 1]]]])'), true);
    assert.deepStrictEqual(esEval('isNaN([[[[33]], 1]])'), true);
    assert.deepStrictEqual(esEval('isNaN([[[[33]]], 1])'), true);
    assert.deepStrictEqual(esEval('isNaN([[[[NaN]]]])'), true);
    assert.deepStrictEqual(esEval('isNaN([[[["123"]]]])'), false);
    assert.deepStrictEqual(esEval('isNaN([[[["str"]]]])'), true);

    // String
    assert.deepStrictEqual(esEval('isNaN("undefined")'), true);
    assert.deepStrictEqual(esEval('isNaN("NaN")'), true);
    assert.deepStrictEqual(esEval('isNaN("Infinity")'), false);
    assert.deepStrictEqual(esEval('isNaN("-Infinity")'), false);
    assert.deepStrictEqual(esEval('isNaN("false")'), true);
    assert.deepStrictEqual(esEval('isNaN("true")'), true);
    assert.deepStrictEqual(esEval('isNaN("null")'), true);
    assert.deepStrictEqual(esEval('isNaN("")'), false);
    assert.deepStrictEqual(esEval(`isNaN("''")`), true);
    assert.deepStrictEqual(esEval(`isNaN('""')`), true);
    assert.deepStrictEqual(esEval('isNaN("any string")'), true);
    assert.deepStrictEqual(esEval('isNaN("0")'), false);
    assert.deepStrictEqual(esEval('isNaN("-0")'), false);
    assert.deepStrictEqual(esEval('isNaN("-12.89")'), false);
    assert.deepStrictEqual(esEval('isNaN("12.89")'), false);
    assert.deepStrictEqual(esEval('isNaN("12.89x56")'), true);
    assert.deepStrictEqual(esEval('isNaN("   12.89   ")'), false);
    assert.deepStrictEqual(esEval('isNaN(() => "12.89")'), true);
  });
});
