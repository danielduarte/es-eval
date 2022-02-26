const assert = require('assert');
const esEval = require('../..');

describe('Binary operations', function () {

  describe('Arithmetic', function () {
    it('can add (+)', function () {
      assert.deepStrictEqual(esEval('1 + 2'), 3);
    });

    it('can subtract (-)', function () {
      assert.deepStrictEqual(esEval('1 - 2'), -1);
    });

    it('can multiply (*)', function () {
      assert.deepStrictEqual(esEval('3 * 4'), 12);
    });

    it('can divide (/)', function () {
      assert.deepStrictEqual(esEval('3 / 4'), 0.75);
    });

    it('can calculate modulus (%)', function () {
      assert.deepStrictEqual(esEval('10 % 3'), 1);
    });

    it('can calculate exponentiation (**)', function () {
      assert.deepStrictEqual(esEval('5 ** 3'), 125);
    });
  });

  describe('Comparison', function () {
    it('can compare by less than (<)', function () {
      assert.deepStrictEqual(esEval('20 < 19'), false);
      assert.deepStrictEqual(esEval('20 < 20'), false);
      assert.deepStrictEqual(esEval('20 < 21'), true);
    });

    it('can compare by greater than (>)', function () {
      assert.deepStrictEqual(esEval('20 > 19'), true);
      assert.deepStrictEqual(esEval('20 > 20'), false);
      assert.deepStrictEqual(esEval('20 > 21'), false);
    });

    it('can compare by less or equal (<=)', function () {
      assert.deepStrictEqual(esEval('20 <= 19'), false);
      assert.deepStrictEqual(esEval('20 <= 20'), true);
      assert.deepStrictEqual(esEval('20 <= 21'), true);
    });

    it('can compare by greater or equal (>=)', function () {
      assert.deepStrictEqual(esEval('20 >= 19'), true);
      assert.deepStrictEqual(esEval('20 >= 20'), true);
      assert.deepStrictEqual(esEval('20 >= 21'), false);
    });

    it('can compare by equality (==)', function () {
      assert.deepStrictEqual(esEval('4 == 5'), false);
      assert.deepStrictEqual(esEval('5 == 5'), true);
    });

    it('can compare by inequality (!=)', function () {
      assert.deepStrictEqual(esEval('4 != 5'), true);
      assert.deepStrictEqual(esEval('5 != 5'), false);
    });

    it('can compare by strict equality (===)', function () {
      assert.deepStrictEqual(esEval('4 === 5'), false);
      assert.deepStrictEqual(esEval('5 === 5'), true);
    });

    it('can compare by strict inequality (!==)', function () {
      assert.deepStrictEqual(esEval('4 !== 5'), true);
      assert.deepStrictEqual(esEval('5 !== 5'), false);
    });
  });

  describe('Bitwise', function () {
    it('can calculate bitwise left shift (<<)', function () {
      assert.deepStrictEqual(esEval('100 << 3'), 800);
    });

    it('can calculate bitwise right shift (>>)', function () {
      assert.deepStrictEqual(esEval('100 >> 3'), 12);
    });

    it('can calculate bitwise unsigned right shift (>>>)', function () {
      assert.deepStrictEqual(esEval('100 >>> 3'), 12);
    });

    it('can calculate bitwise AND (&)', function () {
      assert.deepStrictEqual(esEval('111 & 112'), 96);
    });

    it('can calculate bitwise OR (|)', function () {
      assert.deepStrictEqual(esEval('111 | 112'), 127);
    });

    it('can calculate bitwise XOR (^)', function () {
      assert.deepStrictEqual(esEval('111 ^ 112'), 31);
    });
  });

  describe('Logical', function () {
    it('can calculate logical AND (&&)', function () {
      assert.deepStrictEqual(esEval('11 && 55'), 55);
      assert.deepStrictEqual(esEval('0 && 55'), 0);
      assert.deepStrictEqual(esEval('11 && 0'), 0);
    });

    it('can calculate logical OR (||)', function () {
      assert.deepStrictEqual(esEval('11 || 55'), 11);
      assert.deepStrictEqual(esEval('0 || 55'), 55);
      assert.deepStrictEqual(esEval('11 || 0'), 11);
    });

    it('can calculate nullish coalescing (??)', function () {
      assert.deepStrictEqual(esEval('11 ?? 55'), 11);
      assert.deepStrictEqual(esEval('0 ?? 55'), 0);
      assert.deepStrictEqual(esEval('11 ?? 0'), 11);
    });
  });
});
