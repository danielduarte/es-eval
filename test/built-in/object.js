const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Object built-in properties and methods', function () {

  // it('Object constructor exists and is valid', function () {
  //   assert.deepStrictEqual(esEval('typeof Object'), 'function'); // @todo(fix) return correct type for built-in constructors
  // });

  it('entries', function () {
    assert.deepStrictEqual(esEval('typeof Object.entries'), 'function');
    assert.deepStrictEqual(esEval('Object.entries({ a: 1, b: 2, c: 3 })'), [['a', 1], ['b', 2], ['c', 3]]);
    assert.deepStrictEqual(esEval('Object.entries(x => x)'), [])
  });

  it('keys', function () {
    assert.deepStrictEqual(esEval('typeof Object.keys'), 'function');
    assert.deepStrictEqual(esEval('Object.keys({ a: 1, b: 2, c: 3 })'), ['a', 'b', 'c']);
    assert.deepStrictEqual(esEval('Object.keys(x => x)'), []);
  });

  it('values', function () {
    assert.deepStrictEqual(esEval('typeof Object.values'), 'function');
    assert.deepStrictEqual(esEval('Object.values({ a: 1, b: 2, c: 3 })'), [1, 2, 3]);
    assert.deepStrictEqual(esEval('Object.values(x => x)'), []);
  });
});
