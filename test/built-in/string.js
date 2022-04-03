const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('String built-in properties and methods', function () {

  // it('String constructor exists and is valid', function () {
  //   assert.deepStrictEqual(esEval('typeof String'), 'function'); // @todo(fix) return correct type for built-in constructors
  // });

  // @todo(feat) implement property String.prototype.length
  // it('length', function () {
  //   assert.deepStrictEqual(esEval('typeof "abc".length'), 'number');
  //   assert.deepStrictEqual(esEval('"".length'), 0);
  //   assert.deepStrictEqual(esEval('"  abc  ".length'), 5);
  //   assert.deepStrictEqual(esEval('(() => { const str = "abc"; str.length = 10; return str.length; })()'), 3);
  // });

  it('valueOf', function () {
    assert.deepStrictEqual(esEval('typeof "abc".valueOf'), 'function');
    assert.deepStrictEqual(esEval('"abc".valueOf()'), 'abc');
  });

  it('toLowerCase', function () {
    assert.deepStrictEqual(esEval('typeof "abc".toLowerCase'), 'function');
    assert.deepStrictEqual(esEval('"aBcD".toLowerCase()'), 'abcd');
  });

  it('toUpperCase', function () {
    assert.deepStrictEqual(esEval('typeof "abc".toUpperCase'), 'function');
    assert.deepStrictEqual(esEval('"aBcD".toUpperCase()'), 'ABCD');
  });

  it('trim', function () {
    assert.deepStrictEqual(esEval('typeof "abc".trim'), 'function');
    assert.deepStrictEqual(esEval('"   abc   ".trim()'), 'abc');
  });

  it('trimStart', function () {
    assert.deepStrictEqual(esEval('typeof "abc".trimStart'), 'function');
    assert.deepStrictEqual(esEval('"   abc   ".trimStart()'), 'abc   ');
  });

  it('trimLeft', function () {
    assert.deepStrictEqual(esEval('typeof "abc".trimLeft'), 'function');
    assert.deepStrictEqual(esEval('"   abc   ".trimLeft()'), 'abc   ');
  });

  it('trimEnd', function () {
    assert.deepStrictEqual(esEval('typeof "abc".trimEnd'), 'function');
    assert.deepStrictEqual(esEval('"   abc   ".trimEnd()'), '   abc');
  });

  it('trimRight', function () {
    assert.deepStrictEqual(esEval('typeof "abc".trimRight'), 'function');
    assert.deepStrictEqual(esEval('"   abc   ".trimRight()'), '   abc');
  });

  it('toString', function () {
    assert.deepStrictEqual(esEval('typeof "abc".toString'), 'function');
    assert.deepStrictEqual(esEval('"abc".toString()'), 'abc');
  });

  it('valueOf', function () {
    assert.deepStrictEqual(esEval('typeof "abc".valueOf'), 'function');
    assert.deepStrictEqual(esEval('"abc".valueOf()'), 'abc');
  });
});
