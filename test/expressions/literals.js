const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Literals', function () {

  it('number', function () {
    assert.deepStrictEqual(esEval('0'), 0);
    assert.deepStrictEqual(esEval('1234'), 1234);
    assert.deepStrictEqual(esEval('Infinity'), Infinity);
    assert.deepStrictEqual(esEval('NaN'), NaN);
  });

  it('undefined', function () {
    assert.deepStrictEqual(esEval('undefined'), void 0);
  });

  it('boolean', function () {
    assert.deepStrictEqual(esEval('false'), false);
    assert.deepStrictEqual(esEval('true'), true);
  });

  it('string', function () {
    assert.deepStrictEqual(esEval("''"), '');
    assert.deepStrictEqual(esEval('""'), '');
    assert.deepStrictEqual(esEval('"hello"'), 'hello');
    // @todo Add support for template strings
    // assert.deepStrictEqual(esEval('``'), '');
  });

  it('object', function () {
    assert.deepStrictEqual(esEval('{}'), {});
    assert.deepStrictEqual(esEval('{ a: 1 }'), { a: 1 });
    assert.deepStrictEqual(esEval('{ a: undefined }'), { a: void 0 });
    assert.deepStrictEqual(esEval('{ a: false }'), { a: false });
    assert.deepStrictEqual(esEval('{ a: true }'), { a: true });
    assert.deepStrictEqual(esEval('{ a: "test" }'), { a: 'test' });
    assert.deepStrictEqual(esEval('{ a: 1, b: 2, c: 3 }'), { a: 1, b: 2, c: 3 });
  });
});
