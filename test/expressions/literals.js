const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { CONTEXT_DEFAULT, CONTEXT_EMPTY } = require('../../lib/context/defaults');
const { assertError } = require('../utils');

describe('Literals', function () {

  it('number', function () {
    assert.deepStrictEqual(esEval('0'), 0);
    assert.deepStrictEqual(esEval('1234'), 1234);
    assert.deepStrictEqual(esEval('Infinity'), Infinity);
    assert.deepStrictEqual(esEval('NaN'), NaN);

    // Error cases
    assertError(() => esEval('() => { const c = NaN; }').exec([], CONTEXT_EMPTY), "Identifier not defined: 'NaN'");
    assertError(() => esEval('() => { const c = Infinity; }').exec([], CONTEXT_EMPTY), "Identifier not defined: 'Infinity'");
  });

  it('undefined', function () {
    assert.deepStrictEqual(esEval('undefined'), void 0);

    // Error cases
    assertError(() => esEval('() => { const c = undefined; }').exec([], CONTEXT_EMPTY), "Identifier not defined: 'undefined'");
  });

  it('boolean', function () {
    assert.deepStrictEqual(esEval('false'), false);
    assert.deepStrictEqual(esEval('true'), true);
  });

  it('string', function () {
    assert.deepStrictEqual(esEval("''"), '');
    assert.deepStrictEqual(esEval('""'), '');
    assert.deepStrictEqual(esEval('"hello"'), 'hello');
    // assert.deepStrictEqual(esEval('``'), ''); // @todo(feat) Add support for template strings
  });

  it('object', function () {
    assert.deepStrictEqual(esEval('{}'), {});
    assert.deepStrictEqual(esEval('{ a: 1 }'), { a: 1 });
    assert.deepStrictEqual(esEval('{ a: undefined }'), { a: void 0 });
    assert.deepStrictEqual(esEval('{ a: false }'), { a: false });
    assert.deepStrictEqual(esEval('{ a: true }'), { a: true });
    assert.deepStrictEqual(esEval('{ a: "test" }'), { a: 'test' });
    assert.deepStrictEqual(esEval('{ a: 1, b: 2, c: 3 }'), { a: 1, b: 2, c: 3 });
    assert.deepStrictEqual(esEval('null'), null);
    assert.deepStrictEqual(esEval('{ a: null }'), { a: null });
  });

  it('array', function () {
    assert.deepStrictEqual(esEval('[]'), []);
    assert.deepStrictEqual(esEval('[1, 2, 3]'), [1, 2, 3]);
    assert.deepStrictEqual(esEval('[123, true, false, undefined, NaN, Infinity, "", { a: 1 }, [1, 2, 3, []], null]'), [123, true, false, void 0, NaN, Infinity, "", { a: 1 }, [1, 2, 3, []], null]);
  });
});
