const assert = require('assert');
const esEval = require('../..');

describe('Binary operations', function () {

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

  it('can compare with <', function () {
    assert.deepStrictEqual(esEval('20 < 19'), false);
    assert.deepStrictEqual(esEval('20 < 20'), false);
    assert.deepStrictEqual(esEval('20 < 21'), true);
  });

  it('can compare with >', function () {
    assert.deepStrictEqual(esEval('20 > 19'), true);
    assert.deepStrictEqual(esEval('20 > 20'), false);
    assert.deepStrictEqual(esEval('20 > 21'), false);
  });

  it('can compare with <=', function () {
    assert.deepStrictEqual(esEval('20 <= 19'), false);
    assert.deepStrictEqual(esEval('20 <= 20'), true);
    assert.deepStrictEqual(esEval('20 <= 21'), true);
  });

  it('can compare with >=', function () {
    assert.deepStrictEqual(esEval('20 >= 19'), true);
    assert.deepStrictEqual(esEval('20 >= 20'), true);
    assert.deepStrictEqual(esEval('20 >= 21'), false);
  });

  it('can compare with ==', function () {
    assert.deepStrictEqual(esEval('4 == 5'), false);
    assert.deepStrictEqual(esEval('5 == 5'), true);
  });

  it('can compare with !=', function () {
    assert.deepStrictEqual(esEval('4 != 5'), true);
    assert.deepStrictEqual(esEval('5 != 5'), false);
  });

  it('can compare with ===', function () {
    assert.deepStrictEqual(esEval('4 === 5'), false);
    assert.deepStrictEqual(esEval('5 === 5'), true);
  });

  it('can compare with !==', function () {
    assert.deepStrictEqual(esEval('4 !== 5'), true);
    assert.deepStrictEqual(esEval('5 !== 5'), false);
  });

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
