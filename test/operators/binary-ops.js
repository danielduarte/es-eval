const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

// @todo test NaN, +-Infinity and other related values
// @todo test objects and arrays

describe('Binary operations', function () {

  describe('Arithmetic', function () {
    it('can add (+)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('1 + 2'), 3);

      // Undefined
      assert.deepStrictEqual(esEval('undefined + undefined'), NaN);

      // Boolean
      assert.deepStrictEqual(esEval('false + false'), 0);
      assert.deepStrictEqual(esEval('false + true'), 1);
      assert.deepStrictEqual(esEval('true + false'), 1);
      assert.deepStrictEqual(esEval('true + true'), 2);

      // String
      // @todo add these tests for the rest of the binary operators
      assert.deepStrictEqual(esEval('"" + ""'), '');
      assert.deepStrictEqual(esEval('"" + "123"'), '123');
      assert.deepStrictEqual(esEval('"" + "abc"'), 'abc');
      assert.deepStrictEqual(esEval('"123" + ""'), '123');
      assert.deepStrictEqual(esEval('"123" + "123"'), '123123');
      assert.deepStrictEqual(esEval('"123" + "abc"'), '123abc');
      assert.deepStrictEqual(esEval('"abc" + ""'), 'abc');
      assert.deepStrictEqual(esEval('"abc" + "123"'), 'abc123');
      assert.deepStrictEqual(esEval('"abc" + "abc"'), 'abcabc');

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined + 2'), NaN);
      assert.deepStrictEqual(esEval('1 + undefined'), NaN);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false + 2'), 2);
      assert.deepStrictEqual(esEval('1 + false'), 1);
      assert.deepStrictEqual(esEval('true + 2'), 3);
      assert.deepStrictEqual(esEval('1 + true'), 2);

      // Number with String
      // @todo add these tests for the rest of the binary operators
      assert.deepStrictEqual(esEval('"" + 2'), '2');
      assert.deepStrictEqual(esEval('1 + ""'), '1');
      assert.deepStrictEqual(esEval('"123" + 2'), '1232');
      assert.deepStrictEqual(esEval('1 + "123"'), '1123');
      assert.deepStrictEqual(esEval('"abc" + 2'), 'abc2');
      assert.deepStrictEqual(esEval('1 + "abc"'), '1abc');

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false + undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined + false'), NaN);
      assert.deepStrictEqual(esEval('true + undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined + true'), NaN);

      // Undefined with String
      // @todo add these tests for the rest of the binary operators
      assert.deepStrictEqual(esEval('"" + undefined'), 'undefined');
      assert.deepStrictEqual(esEval('undefined + ""'), 'undefined');
      assert.deepStrictEqual(esEval('"abc" + undefined'), 'abcundefined');
      assert.deepStrictEqual(esEval('undefined + "abc"'), 'undefinedabc');

      // Boolean with String
      // @todo add these tests for the rest of the binary operators
      assert.deepStrictEqual(esEval('false + ""'), 'false');
      assert.deepStrictEqual(esEval('false + "abc"'), 'falseabc');
      assert.deepStrictEqual(esEval('true + ""'), 'true');
      assert.deepStrictEqual(esEval('true + "abc"'), 'trueabc');
      assert.deepStrictEqual(esEval('"" + false'), 'false');
      assert.deepStrictEqual(esEval('"abc" + false'), 'abcfalse');
      assert.deepStrictEqual(esEval('"" + true'), 'true');
      assert.deepStrictEqual(esEval('"abc" + true'), 'abctrue');
    });

    it('can subtract (-)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('1 - 2'), -1);

      // Undefined
      assert.deepStrictEqual(esEval('undefined - undefined'), NaN);

      // Boolean
      assert.deepStrictEqual(esEval('false - false'), 0);
      assert.deepStrictEqual(esEval('false - true'), -1);
      assert.deepStrictEqual(esEval('true - false'), 1);
      assert.deepStrictEqual(esEval('true - true'), 0);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined - 2'), NaN);
      assert.deepStrictEqual(esEval('1 - undefined'), NaN);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false - 2'), -2);
      assert.deepStrictEqual(esEval('1 - false'), 1);
      assert.deepStrictEqual(esEval('true - 2'), -1);
      assert.deepStrictEqual(esEval('1 - true'), 0);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false - undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined - false'), NaN);
      assert.deepStrictEqual(esEval('true - undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined - true'), NaN);
    });

    it('can multiply (*)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('3 * 4'), 12);

      // Undefined
      assert.deepStrictEqual(esEval('undefined * undefined'), NaN);

      // Boolean
      assert.deepStrictEqual(esEval('false * false'), 0);
      assert.deepStrictEqual(esEval('false * true'), 0);
      assert.deepStrictEqual(esEval('true * false'), 0);
      assert.deepStrictEqual(esEval('true * true'), 1);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined * 4'), NaN);
      assert.deepStrictEqual(esEval('3 * undefined'), NaN);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false * 2'), 0);
      assert.deepStrictEqual(esEval('1 * false'), 0);
      assert.deepStrictEqual(esEval('true * 2'), 2);
      assert.deepStrictEqual(esEval('1 * true'), 1);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false * undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined * false'), NaN);
      assert.deepStrictEqual(esEval('true * undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined * true'), NaN);
    });

    it('can divide (/)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('3 / 4'), 0.75);

      // Undefined
      assert.deepStrictEqual(esEval('undefined / undefined'), NaN);

      // Boolean
      assert.deepStrictEqual(esEval('false / false'), NaN);
      assert.deepStrictEqual(esEval('false / true'), 0);
      assert.deepStrictEqual(esEval('true / false'), Infinity);
      assert.deepStrictEqual(esEval('true / true'), 1);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined / 4'), NaN);
      assert.deepStrictEqual(esEval('3 / undefined'), NaN);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false / 2'), 0);
      assert.deepStrictEqual(esEval('1 / false'), Infinity);
      assert.deepStrictEqual(esEval('true / 2'), 0.5);
      assert.deepStrictEqual(esEval('1 / true'), 1);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false / undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined / false'), NaN);
      assert.deepStrictEqual(esEval('true / undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined / true'), NaN);
    });

    it('can calculate modulus (%)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('10 % 3'), 1);

      // Undefined
      assert.deepStrictEqual(esEval('undefined % undefined'), NaN);

      // Boolean
      assert.deepStrictEqual(esEval('false % false'), NaN);
      assert.deepStrictEqual(esEval('false % true'), 0);
      assert.deepStrictEqual(esEval('true % false'), NaN);
      assert.deepStrictEqual(esEval('true % true'), 0);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined % 3'), NaN);
      assert.deepStrictEqual(esEval('10 % undefined'), NaN);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false % 2'), 0);
      assert.deepStrictEqual(esEval('1 % false'), NaN);
      assert.deepStrictEqual(esEval('true % 2'), 1);
      assert.deepStrictEqual(esEval('1 % true'), 0);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false % undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined % false'), NaN);
      assert.deepStrictEqual(esEval('true % undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined % true'), NaN);
    });

    it('can calculate exponentiation (**)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('5 ** 3'), 125);

      // Undefined
      assert.deepStrictEqual(esEval('undefined ** undefined'), NaN);

      // Boolean
      assert.deepStrictEqual(esEval('false ** false'), 1);
      assert.deepStrictEqual(esEval('false ** true'), 0);
      assert.deepStrictEqual(esEval('true ** false'), 1);
      assert.deepStrictEqual(esEval('true ** true'), 1);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined ** 3'), NaN);
      assert.deepStrictEqual(esEval('5 ** undefined'), NaN);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false ** 2'), 0);
      assert.deepStrictEqual(esEval('1 ** false'), 1);
      assert.deepStrictEqual(esEval('true ** 2'), 1);
      assert.deepStrictEqual(esEval('1 ** true'), 1);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false ** undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined ** false'), 1);
      assert.deepStrictEqual(esEval('true ** undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined ** true'), NaN);
    });
  });

  describe('Comparison', function () {
    it('can compare by less than (<)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('20 < 19'), false);
      assert.deepStrictEqual(esEval('20 < 20'), false);
      assert.deepStrictEqual(esEval('20 < 21'), true);

      // Undefined
      assert.deepStrictEqual(esEval('undefined < undefined'), false);

      // Boolean
      assert.deepStrictEqual(esEval('false < false'), false);
      assert.deepStrictEqual(esEval('false < true'), true);
      assert.deepStrictEqual(esEval('true < false'), false);
      assert.deepStrictEqual(esEval('true < true'), false);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined < 21'), false);
      assert.deepStrictEqual(esEval('20 < undefined'), false);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false < 2'), true);
      assert.deepStrictEqual(esEval('1 < false'), false);
      assert.deepStrictEqual(esEval('true < 2'), true);
      assert.deepStrictEqual(esEval('1 < true'), false);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false < undefined'), false);
      assert.deepStrictEqual(esEval('undefined < false'), false);
      assert.deepStrictEqual(esEval('true < undefined'), false);
      assert.deepStrictEqual(esEval('undefined < true'), false);
    });

    it('can compare by greater than (>)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('20 > 19'), true);
      assert.deepStrictEqual(esEval('20 > 20'), false);
      assert.deepStrictEqual(esEval('20 > 21'), false);

      // Undefined
      assert.deepStrictEqual(esEval('undefined > undefined'), false);

      // Boolean
      assert.deepStrictEqual(esEval('false > false'), false);
      assert.deepStrictEqual(esEval('false > true'), false);
      assert.deepStrictEqual(esEval('true > false'), true);
      assert.deepStrictEqual(esEval('true > true'), false);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined > 21'), false);
      assert.deepStrictEqual(esEval('20 > undefined'), false);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false > 2'), false);
      assert.deepStrictEqual(esEval('1 > false'), true);
      assert.deepStrictEqual(esEval('true > 2'), false);
      assert.deepStrictEqual(esEval('1 > true'), false);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false > undefined'), false);
      assert.deepStrictEqual(esEval('undefined > false'), false);
      assert.deepStrictEqual(esEval('true > undefined'), false);
      assert.deepStrictEqual(esEval('undefined > true'), false);
    });

    it('can compare by less or equal (<=)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('20 <= 19'), false);
      assert.deepStrictEqual(esEval('20 <= 20'), true);
      assert.deepStrictEqual(esEval('20 <= 21'), true);

      // Undefined
      assert.deepStrictEqual(esEval('undefined <= undefined'), false);

      // Boolean
      assert.deepStrictEqual(esEval('false <= false'), true);
      assert.deepStrictEqual(esEval('false <= true'), true);
      assert.deepStrictEqual(esEval('true <= false'), false);
      assert.deepStrictEqual(esEval('true <= true'), true);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined <= 21'), false);
      assert.deepStrictEqual(esEval('20 <= undefined'), false);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false <= 2'), true);
      assert.deepStrictEqual(esEval('1 <= false'), false);
      assert.deepStrictEqual(esEval('true <= 2'), true);
      assert.deepStrictEqual(esEval('1 <= true'), true);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false <= undefined'), false);
      assert.deepStrictEqual(esEval('undefined <= false'), false);
      assert.deepStrictEqual(esEval('true <= undefined'), false);
      assert.deepStrictEqual(esEval('undefined <= true'), false);
    });

    it('can compare by greater or equal (>=)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('20 >= 19'), true);
      assert.deepStrictEqual(esEval('20 >= 20'), true);
      assert.deepStrictEqual(esEval('20 >= 21'), false);

      // Undefined
      assert.deepStrictEqual(esEval('undefined >= undefined'), false);

      // Boolean
      assert.deepStrictEqual(esEval('false >= false'), true);
      assert.deepStrictEqual(esEval('false >= true'), false);
      assert.deepStrictEqual(esEval('true >= false'), true);
      assert.deepStrictEqual(esEval('true >= true'), true);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined >= 21'), false);
      assert.deepStrictEqual(esEval('20 >= undefined'), false);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false >= 2'), false);
      assert.deepStrictEqual(esEval('1 >= false'), true);
      assert.deepStrictEqual(esEval('true >= 2'), false);
      assert.deepStrictEqual(esEval('1 >= true'), true);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false >= undefined'), false);
      assert.deepStrictEqual(esEval('undefined >= false'), false);
      assert.deepStrictEqual(esEval('true >= undefined'), false);
      assert.deepStrictEqual(esEval('undefined >= true'), false);
    });

    it('can compare by equality (==)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('4 == 5'), false);
      assert.deepStrictEqual(esEval('5 == 5'), true);

      // Undefined
      assert.deepStrictEqual(esEval('undefined == undefined'), true);

      // Boolean
      assert.deepStrictEqual(esEval('false == false'), true);
      assert.deepStrictEqual(esEval('false == true'), false);
      assert.deepStrictEqual(esEval('true == false'), false);
      assert.deepStrictEqual(esEval('true == true'), true);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined == 21'), false);
      assert.deepStrictEqual(esEval('20 == undefined'), false);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false == 2'), false);
      assert.deepStrictEqual(esEval('1 == false'), false);
      assert.deepStrictEqual(esEval('true == 2'), false);
      assert.deepStrictEqual(esEval('1 == true'), true);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false == undefined'), false);
      assert.deepStrictEqual(esEval('undefined == false'), false);
      assert.deepStrictEqual(esEval('true == undefined'), false);
      assert.deepStrictEqual(esEval('undefined == true'), false);
    });

    it('can compare by inequality (!=)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('4 != 5'), true);
      assert.deepStrictEqual(esEval('5 != 5'), false);

      // Undefined
      assert.deepStrictEqual(esEval('undefined != undefined'), false);

      // Boolean
      assert.deepStrictEqual(esEval('false != false'), false);
      assert.deepStrictEqual(esEval('false != true'), true);
      assert.deepStrictEqual(esEval('true != false'), true);
      assert.deepStrictEqual(esEval('true != true'), false);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined != 21'), true);
      assert.deepStrictEqual(esEval('20 != undefined'), true);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false != 2'), true);
      assert.deepStrictEqual(esEval('1 != false'), true);
      assert.deepStrictEqual(esEval('true != 2'), true);
      assert.deepStrictEqual(esEval('1 != true'), false);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false != undefined'), true);
      assert.deepStrictEqual(esEval('undefined != false'), true);
      assert.deepStrictEqual(esEval('true != undefined'), true);
      assert.deepStrictEqual(esEval('undefined != true'), true);
    });

    it('can compare by strict equality (===)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('4 === 5'), false);
      assert.deepStrictEqual(esEval('5 === 5'), true);

      // Undefined
      assert.deepStrictEqual(esEval('undefined === undefined'), true);

      // Boolean
      assert.deepStrictEqual(esEval('false === false'), true);
      assert.deepStrictEqual(esEval('false === true'), false);
      assert.deepStrictEqual(esEval('true === false'), false);
      assert.deepStrictEqual(esEval('true === true'), true);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined === 21'), false);
      assert.deepStrictEqual(esEval('20 === undefined'), false);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false === 2'), false);
      assert.deepStrictEqual(esEval('1 === false'), false);
      assert.deepStrictEqual(esEval('true === 2'), false);
      assert.deepStrictEqual(esEval('1 === true'), false);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false === undefined'), false);
      assert.deepStrictEqual(esEval('undefined === false'), false);
      assert.deepStrictEqual(esEval('true === undefined'), false);
      assert.deepStrictEqual(esEval('undefined === true'), false);
    });

    it('can compare by strict inequality (!==)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('4 !== 5'), true);
      assert.deepStrictEqual(esEval('5 !== 5'), false);

      // Undefined
      assert.deepStrictEqual(esEval('undefined !== undefined'), false);

      // Boolean
      assert.deepStrictEqual(esEval('false !== false'), false);
      assert.deepStrictEqual(esEval('false !== true'), true);
      assert.deepStrictEqual(esEval('true !== false'), true);
      assert.deepStrictEqual(esEval('true !== true'), false);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined !== 21'), true);
      assert.deepStrictEqual(esEval('20 !== undefined'), true);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false !== 2'), true);
      assert.deepStrictEqual(esEval('1 !== false'), true);
      assert.deepStrictEqual(esEval('true !== 2'), true);
      assert.deepStrictEqual(esEval('1 !== true'), true);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false !== undefined'), true);
      assert.deepStrictEqual(esEval('undefined !== false'), true);
      assert.deepStrictEqual(esEval('true !== undefined'), true);
      assert.deepStrictEqual(esEval('undefined !== true'), true);
    });
  });

  describe('Bitwise', function () {
    it('can calculate bitwise left shift (<<)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('100 << 3'), 800);

      // Undefined
      assert.deepStrictEqual(esEval('undefined << undefined'), 0);

      // Boolean
      assert.deepStrictEqual(esEval('false << false'), 0);
      assert.deepStrictEqual(esEval('false << true'), 0);
      assert.deepStrictEqual(esEval('true << false'), 1);
      assert.deepStrictEqual(esEval('true << true'), 2);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined << 3'), 0);
      assert.deepStrictEqual(esEval('100 << undefined'), 100);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false << 2'), 0);
      assert.deepStrictEqual(esEval('1 << false'), 1);
      assert.deepStrictEqual(esEval('true << 2'), 4);
      assert.deepStrictEqual(esEval('1 << true'), 2);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false << undefined'), 0);
      assert.deepStrictEqual(esEval('undefined << false'), 0);
      assert.deepStrictEqual(esEval('true << undefined'), 1);
      assert.deepStrictEqual(esEval('undefined << true'), 0);
    });

    it('can calculate bitwise right shift (>>)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('100 >> 3'), 12);

      // Undefined
      assert.deepStrictEqual(esEval('undefined >> undefined'), 0);

      // Boolean
      assert.deepStrictEqual(esEval('false >> false'), 0);
      assert.deepStrictEqual(esEval('false >> true'), 0);
      assert.deepStrictEqual(esEval('true >> false'), 1);
      assert.deepStrictEqual(esEval('true >> true'), 0);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined >> 3'), 0);
      assert.deepStrictEqual(esEval('100 >> undefined'), 100);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false >> 2'), 0);
      assert.deepStrictEqual(esEval('1 >> false'), 1);
      assert.deepStrictEqual(esEval('true >> 2'), 0);
      assert.deepStrictEqual(esEval('1 >> true'), 0);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false >> undefined'), 0);
      assert.deepStrictEqual(esEval('undefined >> false'), 0);
      assert.deepStrictEqual(esEval('true >> undefined'), 1);
      assert.deepStrictEqual(esEval('undefined >> true'), 0);
    });

    it('can calculate bitwise unsigned right shift (>>>)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('100 >>> 3'), 12);

      // Undefined
      assert.deepStrictEqual(esEval('undefined >>> undefined'), 0);

      // Boolean
      assert.deepStrictEqual(esEval('false >>> false'), 0);
      assert.deepStrictEqual(esEval('false >>> true'), 0);
      assert.deepStrictEqual(esEval('true >>> false'), 1);
      assert.deepStrictEqual(esEval('true >>> true'), 0);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined >>> 3'), 0);
      assert.deepStrictEqual(esEval('100 >>> undefined'), 100);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false >>> 2'), 0);
      assert.deepStrictEqual(esEval('1 >>> false'), 1);
      assert.deepStrictEqual(esEval('true >>> 2'), 0);
      assert.deepStrictEqual(esEval('1 >>> true'), 0);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false >>> undefined'), 0);
      assert.deepStrictEqual(esEval('undefined >>> false'), 0);
      assert.deepStrictEqual(esEval('true >>> undefined'), 1);
      assert.deepStrictEqual(esEval('undefined >>> true'), 0);
    });

    it('can calculate bitwise AND (&)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('111 & 112'), 96);

      // Undefined
      assert.deepStrictEqual(esEval('undefined & undefined'), 0);

      // Boolean
      assert.deepStrictEqual(esEval('false & false'), 0);
      assert.deepStrictEqual(esEval('false & true'), 0);
      assert.deepStrictEqual(esEval('true & false'), 0);
      assert.deepStrictEqual(esEval('true & true'), 1);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined & 112'), 0);
      assert.deepStrictEqual(esEval('111 & undefined'), 0);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false & 2'), 0);
      assert.deepStrictEqual(esEval('1 & false'), 0);
      assert.deepStrictEqual(esEval('true & 2'), 0);
      assert.deepStrictEqual(esEval('1 & true'), 1);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false & undefined'), 0);
      assert.deepStrictEqual(esEval('undefined & false'), 0);
      assert.deepStrictEqual(esEval('true & undefined'), 0);
      assert.deepStrictEqual(esEval('undefined & true'), 0);
    });

    it('can calculate bitwise OR (|)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('111 | 112'), 127);

      // Undefined
      assert.deepStrictEqual(esEval('undefined | undefined'), 0);

      // Boolean
      assert.deepStrictEqual(esEval('false | false'), 0);
      assert.deepStrictEqual(esEval('false | true'), 1);
      assert.deepStrictEqual(esEval('true | false'), 1);
      assert.deepStrictEqual(esEval('true | true'), 1);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined | 112'), 112);
      assert.deepStrictEqual(esEval('111 | undefined'), 111);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false | 2'), 2);
      assert.deepStrictEqual(esEval('1 | false'), 1);
      assert.deepStrictEqual(esEval('true | 2'), 3);
      assert.deepStrictEqual(esEval('1 | true'), 1);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false | undefined'), 0);
      assert.deepStrictEqual(esEval('undefined | false'), 0);
      assert.deepStrictEqual(esEval('true | undefined'), 1);
      assert.deepStrictEqual(esEval('undefined | true'), 1);
    });

    it('can calculate bitwise XOR (^)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('111 ^ 112'), 31);

      // Undefined
      assert.deepStrictEqual(esEval('undefined ^ undefined'), 0);

      // Boolean
      assert.deepStrictEqual(esEval('false ^ false'), 0);
      assert.deepStrictEqual(esEval('false ^ true'), 1);
      assert.deepStrictEqual(esEval('true ^ false'), 1);
      assert.deepStrictEqual(esEval('true ^ true'), 0);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined ^ 112'), 112);
      assert.deepStrictEqual(esEval('111 ^ undefined'), 111);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false ^ 2'), 2);
      assert.deepStrictEqual(esEval('1 ^ false'), 1);
      assert.deepStrictEqual(esEval('true ^ 2'), 3);
      assert.deepStrictEqual(esEval('1 ^ true'), 0);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false ^ undefined'), 0);
      assert.deepStrictEqual(esEval('undefined ^ false'), 0);
      assert.deepStrictEqual(esEval('true ^ undefined'), 1);
      assert.deepStrictEqual(esEval('undefined ^ true'), 1);
    });
  });

  describe('Logical', function () {
    it('can calculate logical AND (&&)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('11 && 55'), 55);
      assert.deepStrictEqual(esEval('0 && 55'), 0);
      assert.deepStrictEqual(esEval('11 && 0'), 0);

      // Undefined
      assert.deepStrictEqual(esEval('undefined && undefined'), void 0);

      // Boolean
      assert.deepStrictEqual(esEval('false && false'), false);
      assert.deepStrictEqual(esEval('false && true'), false);
      assert.deepStrictEqual(esEval('true && false'), false);
      assert.deepStrictEqual(esEval('true && true'), true);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined && 22'), void 0);
      assert.deepStrictEqual(esEval('undefined && 0'), void 0);
      assert.deepStrictEqual(esEval('11 && undefined'), void 0);
      assert.deepStrictEqual(esEval('0 && undefined'), 0);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false && 2'), false);
      assert.deepStrictEqual(esEval('1 && false'), false);
      assert.deepStrictEqual(esEval('true && 2'), 2);
      assert.deepStrictEqual(esEval('1 && true'), true);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false && undefined'), false);
      assert.deepStrictEqual(esEval('undefined && false'), void 0);
      assert.deepStrictEqual(esEval('true && undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined && true'), void 0);
    });

    it('can calculate logical OR (||)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('11 || 55'), 11);
      assert.deepStrictEqual(esEval('0 || 55'), 55);
      assert.deepStrictEqual(esEval('11 || 0'), 11);

      // Undefined
      assert.deepStrictEqual(esEval('undefined || undefined'), void 0);

      // Boolean
      assert.deepStrictEqual(esEval('false || false'), false);
      assert.deepStrictEqual(esEval('false || true'), true);
      assert.deepStrictEqual(esEval('true || false'), true);
      assert.deepStrictEqual(esEval('true || true'), true);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined || 22'), 22);
      assert.deepStrictEqual(esEval('undefined || 0'), 0);
      assert.deepStrictEqual(esEval('11 || undefined'), 11);
      assert.deepStrictEqual(esEval('0 || undefined'), void 0);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false || 2'), 2);
      assert.deepStrictEqual(esEval('1 || false'), 1);
      assert.deepStrictEqual(esEval('true || 2'), true);
      assert.deepStrictEqual(esEval('1 || true'), 1);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false || undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined || false'), false);
      assert.deepStrictEqual(esEval('true || undefined'), true);
      assert.deepStrictEqual(esEval('undefined || true'), true);
    });

    it('can calculate nullish coalescing (??)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('11 ?? 55'), 11);
      assert.deepStrictEqual(esEval('0 ?? 55'), 0);
      assert.deepStrictEqual(esEval('11 ?? 0'), 11);

      // Undefined
      assert.deepStrictEqual(esEval('undefined ?? undefined'), void 0);

      // Boolean
      assert.deepStrictEqual(esEval('false ?? false'), false);
      assert.deepStrictEqual(esEval('false ?? true'), false);
      assert.deepStrictEqual(esEval('true ?? false'), true);
      assert.deepStrictEqual(esEval('true ?? true'), true);

      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined ?? 22'), 22);
      assert.deepStrictEqual(esEval('undefined ?? 0'), 0);
      assert.deepStrictEqual(esEval('11 ?? undefined'), 11);
      assert.deepStrictEqual(esEval('0 ?? undefined'), 0);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false ?? 2'), false);
      assert.deepStrictEqual(esEval('1 ?? false'), 1);
      assert.deepStrictEqual(esEval('true ?? 2'), true);
      assert.deepStrictEqual(esEval('1 ?? true'), 1);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false ?? undefined'), false);
      assert.deepStrictEqual(esEval('undefined ?? false'), false);
      assert.deepStrictEqual(esEval('true ?? undefined'), true);
      assert.deepStrictEqual(esEval('undefined ?? true'), true);
    });
  });

  describe('Sequential', function () {
    it('can calculate sequential expressions (,)', function () {
      // Numbers
      assert.deepStrictEqual(esEval('11, 55'), 55);
      assert.deepStrictEqual(esEval('11, 22, 33, 44, 55, 66'), 66);

      // Undefined
      assert.deepStrictEqual(esEval('undefined, undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined, undefined, undefined, undefined'), void 0);

      // Boolean
      assert.deepStrictEqual(esEval('false, false'), false);
      assert.deepStrictEqual(esEval('false, true'), true);
      assert.deepStrictEqual(esEval('true, false'), false);
      assert.deepStrictEqual(esEval('true, true'), true);
      assert.deepStrictEqual(esEval('true, false, true, false'), false);
      assert.deepStrictEqual(esEval('false, true, false, true'), true);


      // Numbers with Undefined
      assert.deepStrictEqual(esEval('undefined, 55'), 55);
      assert.deepStrictEqual(esEval('11, undefined'), void 0);
      assert.deepStrictEqual(esEval('11, undefined, 33, 44, undefined, 66'), 66);

      // Numbers with Boolean
      assert.deepStrictEqual(esEval('false, 2'), 2);
      assert.deepStrictEqual(esEval('1, false'), false);
      assert.deepStrictEqual(esEval('true, 2'), 2);
      assert.deepStrictEqual(esEval('1, true'), true);

      // Undefined with Boolean
      assert.deepStrictEqual(esEval('false, undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined, false'), false);
      assert.deepStrictEqual(esEval('true, undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined, true'), true);
    });
  });
});
