const assert = require('assert');
const esEval = require('../..');

// @todo test NaN, +-Infinity and other related valuess

describe('Binary operations', function () {

  describe('Arithmetic', function () {
    it('can add (+)', function () {
      assert.deepStrictEqual(esEval('1 + 2'), 3);
      assert.deepStrictEqual(esEval('undefined + 2'), NaN);
      assert.deepStrictEqual(esEval('1 + undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined + undefined'), NaN);
    });

    it('can subtract (-)', function () {
      assert.deepStrictEqual(esEval('1 - 2'), -1);
      assert.deepStrictEqual(esEval('undefined - 2'), NaN);
      assert.deepStrictEqual(esEval('1 - undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined - undefined'), NaN);
    });

    it('can multiply (*)', function () {
      assert.deepStrictEqual(esEval('3 * 4'), 12);
      assert.deepStrictEqual(esEval('undefined * 4'), NaN);
      assert.deepStrictEqual(esEval('3 * undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined * undefined'), NaN);
    });

    it('can divide (/)', function () {
      assert.deepStrictEqual(esEval('3 / 4'), 0.75);
      assert.deepStrictEqual(esEval('undefined / 4'), NaN);
      assert.deepStrictEqual(esEval('3 / undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined / undefined'), NaN);
    });

    it('can calculate modulus (%)', function () {
      assert.deepStrictEqual(esEval('10 % 3'), 1);
      assert.deepStrictEqual(esEval('undefined % 3'), NaN);
      assert.deepStrictEqual(esEval('10 % undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined % undefined'), NaN);
    });

    it('can calculate exponentiation (**)', function () {
      assert.deepStrictEqual(esEval('5 ** 3'), 125);
      assert.deepStrictEqual(esEval('undefined ** 3'), NaN);
      assert.deepStrictEqual(esEval('5 ** undefined'), NaN);
      assert.deepStrictEqual(esEval('undefined ** undefined'), NaN);
    });
  });

  describe('Comparison', function () {
    it('can compare by less than (<)', function () {
      assert.deepStrictEqual(esEval('20 < 19'), false);
      assert.deepStrictEqual(esEval('20 < 20'), false);
      assert.deepStrictEqual(esEval('20 < 21'), true);
      assert.deepStrictEqual(esEval('undefined < 21'), false);
      assert.deepStrictEqual(esEval('20 < undefined'), false);
      assert.deepStrictEqual(esEval('undefined < undefined'), false);
    });

    it('can compare by greater than (>)', function () {
      assert.deepStrictEqual(esEval('20 > 19'), true);
      assert.deepStrictEqual(esEval('20 > 20'), false);
      assert.deepStrictEqual(esEval('20 > 21'), false);
      assert.deepStrictEqual(esEval('undefined > 21'), false);
      assert.deepStrictEqual(esEval('20 > undefined'), false);
      assert.deepStrictEqual(esEval('undefined > undefined'), false);
    });

    it('can compare by less or equal (<=)', function () {
      assert.deepStrictEqual(esEval('20 <= 19'), false);
      assert.deepStrictEqual(esEval('20 <= 20'), true);
      assert.deepStrictEqual(esEval('20 <= 21'), true);
      assert.deepStrictEqual(esEval('undefined <= 21'), false);
      assert.deepStrictEqual(esEval('20 <= undefined'), false);
      assert.deepStrictEqual(esEval('undefined <= undefined'), false);
    });

    it('can compare by greater or equal (>=)', function () {
      assert.deepStrictEqual(esEval('20 >= 19'), true);
      assert.deepStrictEqual(esEval('20 >= 20'), true);
      assert.deepStrictEqual(esEval('20 >= 21'), false);
      assert.deepStrictEqual(esEval('undefined >= 21'), false);
      assert.deepStrictEqual(esEval('20 >= undefined'), false);
      assert.deepStrictEqual(esEval('undefined >= undefined'), false);
    });

    it('can compare by equality (==)', function () {
      assert.deepStrictEqual(esEval('4 == 5'), false);
      assert.deepStrictEqual(esEval('5 == 5'), true);
      assert.deepStrictEqual(esEval('undefined == 21'), false);
      assert.deepStrictEqual(esEval('20 == undefined'), false);
      assert.deepStrictEqual(esEval('undefined == undefined'), true);
    });

    it('can compare by inequality (!=)', function () {
      assert.deepStrictEqual(esEval('4 != 5'), true);
      assert.deepStrictEqual(esEval('5 != 5'), false);
      assert.deepStrictEqual(esEval('undefined != 21'), true);
      assert.deepStrictEqual(esEval('20 != undefined'), true);
      assert.deepStrictEqual(esEval('undefined != undefined'), false);
    });

    it('can compare by strict equality (===)', function () {
      assert.deepStrictEqual(esEval('4 === 5'), false);
      assert.deepStrictEqual(esEval('5 === 5'), true);
      assert.deepStrictEqual(esEval('undefined === 21'), false);
      assert.deepStrictEqual(esEval('20 === undefined'), false);
      assert.deepStrictEqual(esEval('undefined === undefined'), true);
    });

    it('can compare by strict inequality (!==)', function () {
      assert.deepStrictEqual(esEval('4 !== 5'), true);
      assert.deepStrictEqual(esEval('5 !== 5'), false);
      assert.deepStrictEqual(esEval('undefined !== 21'), true);
      assert.deepStrictEqual(esEval('20 !== undefined'), true);
      assert.deepStrictEqual(esEval('undefined !== undefined'), false);
    });
  });

  describe('Bitwise', function () {
    it('can calculate bitwise left shift (<<)', function () {
      assert.deepStrictEqual(esEval('100 << 3'), 800);
      assert.deepStrictEqual(esEval('undefined << 3'), 0);
      assert.deepStrictEqual(esEval('100 << undefined'), 100);
      assert.deepStrictEqual(esEval('undefined << undefined'), 0);
    });

    it('can calculate bitwise right shift (>>)', function () {
      assert.deepStrictEqual(esEval('100 >> 3'), 12);
      assert.deepStrictEqual(esEval('undefined >> 3'), 0);
      assert.deepStrictEqual(esEval('100 >> undefined'), 100);
      assert.deepStrictEqual(esEval('undefined >> undefined'), 0);
    });

    it('can calculate bitwise unsigned right shift (>>>)', function () {
      assert.deepStrictEqual(esEval('100 >>> 3'), 12);
      assert.deepStrictEqual(esEval('undefined >>> 3'), 0);
      assert.deepStrictEqual(esEval('100 >>> undefined'), 100);
      assert.deepStrictEqual(esEval('undefined >>> undefined'), 0);
    });

    it('can calculate bitwise AND (&)', function () {
      assert.deepStrictEqual(esEval('111 & 112'), 96);
      assert.deepStrictEqual(esEval('undefined & 112'), 0);
      assert.deepStrictEqual(esEval('111 & undefined'), 0);
      assert.deepStrictEqual(esEval('undefined & undefined'), 0);
    });

    it('can calculate bitwise OR (|)', function () {
      assert.deepStrictEqual(esEval('111 | 112'), 127);
      assert.deepStrictEqual(esEval('undefined | 112'), 112);
      assert.deepStrictEqual(esEval('111 | undefined'), 111);
      assert.deepStrictEqual(esEval('undefined | undefined'), 0);
    });

    it('can calculate bitwise XOR (^)', function () {
      assert.deepStrictEqual(esEval('111 ^ 112'), 31);
      assert.deepStrictEqual(esEval('undefined ^ 112'), 112);
      assert.deepStrictEqual(esEval('111 ^ undefined'), 111);
      assert.deepStrictEqual(esEval('undefined ^ undefined'), 0);
    });
  });

  describe('Logical', function () {
    it('can calculate logical AND (&&)', function () {
      assert.deepStrictEqual(esEval('11 && 55'), 55);
      assert.deepStrictEqual(esEval('0 && 55'), 0);
      assert.deepStrictEqual(esEval('11 && 0'), 0);
      assert.deepStrictEqual(esEval('undefined && 22'), void 0);
      assert.deepStrictEqual(esEval('undefined && 0'), void 0);
      assert.deepStrictEqual(esEval('11 && undefined'), void 0);
      assert.deepStrictEqual(esEval('0 && undefined'), 0);
      assert.deepStrictEqual(esEval('undefined && undefined'), void 0);
    });

    it('can calculate logical OR (||)', function () {
      assert.deepStrictEqual(esEval('11 || 55'), 11);
      assert.deepStrictEqual(esEval('0 || 55'), 55);
      assert.deepStrictEqual(esEval('11 || 0'), 11);
      assert.deepStrictEqual(esEval('undefined || 22'), 22);
      assert.deepStrictEqual(esEval('undefined || 0'), 0);
      assert.deepStrictEqual(esEval('11 || undefined'), 11);
      assert.deepStrictEqual(esEval('0 || undefined'), void 0);
      assert.deepStrictEqual(esEval('undefined || undefined'), void 0);
    });

    it('can calculate nullish coalescing (??)', function () {
      assert.deepStrictEqual(esEval('11 ?? 55'), 11);
      assert.deepStrictEqual(esEval('0 ?? 55'), 0);
      assert.deepStrictEqual(esEval('11 ?? 0'), 11);
      assert.deepStrictEqual(esEval('undefined ?? 22'), 22);
      assert.deepStrictEqual(esEval('undefined ?? 0'), 0);
      assert.deepStrictEqual(esEval('11 ?? undefined'), 11);
      assert.deepStrictEqual(esEval('0 ?? undefined'), 0);
      assert.deepStrictEqual(esEval('undefined ?? undefined'), void 0);
    });
  });

  describe('Sequential', function () {
    it('can calculate sequential expressions (,)', function () {
      assert.deepStrictEqual(esEval('11, 55'), 55);
      assert.deepStrictEqual(esEval('11, 22, 33, 44, 55, 66'), 66);
      assert.deepStrictEqual(esEval('undefined, 55'), 55);
      assert.deepStrictEqual(esEval('11, undefined'), void 0);
      assert.deepStrictEqual(esEval('11, undefined, 33, 44, undefined, 66'), 66);
    });
  });
});
