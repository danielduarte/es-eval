const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { assertError } = require('../utils');
const { CONTEXT_EMPTY } = require('../../lib/context/defaults');

describe('Variable assignment in lambda expressions (let)', function () {

  it('lambda with assignment', function () {
    assert.deepStrictEqual(esEval('() => { let x; x = 5; return x; }').exec([], CONTEXT_EMPTY), 5);
    assert.deepStrictEqual(esEval('() => { let x = 5; x = 6; return x; }').exec([], CONTEXT_EMPTY), 6);
    assert.deepStrictEqual(esEval('() => { let x; x = 5; x = 8; return x; }').exec([], CONTEXT_EMPTY), 8);
    assert.deepStrictEqual(esEval('() => { let x; x = 6 + 1; return x; }').exec([], CONTEXT_EMPTY), 7);
    assert.deepStrictEqual(esEval('() => { let x, y; x = 5; y = 4; return x + y; }').exec([], CONTEXT_EMPTY), 9);
    assert.deepStrictEqual(esEval('() => { let x, y; x = y = 7; return x + y; }').exec([], CONTEXT_EMPTY), 14);
    assert.deepStrictEqual(esEval('() => { let x = 1, y = 2; x = y = 7; return x + y; }').exec([], CONTEXT_EMPTY), 14);
    assert.deepStrictEqual(esEval('() => { let x; return x = 5; }').exec([], CONTEXT_EMPTY), 5);
    assert.deepStrictEqual(esEval('() => { let x; return x = 6 + 1; }').exec([], CONTEXT_EMPTY), 7);
    assert.deepStrictEqual(esEval('() => { let x, y; return x = y = 7; }').exec([], CONTEXT_EMPTY), 7);
    assert.deepStrictEqual(esEval('() => { let x = 4, y = 8; return x = y; }').exec([], CONTEXT_EMPTY), 8);
    assert.deepStrictEqual(esEval('x => x = 2').exec([], CONTEXT_EMPTY), 2);
    assert.deepStrictEqual(esEval('x => x = 2').exec([3], CONTEXT_EMPTY), 2);
    assert.deepStrictEqual(esEval('x => x = "a"').exec([], CONTEXT_EMPTY), 'a');
  });

  it('lambda with re-assigned constant', function () {
    let errMessage = 'NO ERROR';
    try {
      esEval('() => { const c = 1; c = 2; }').exec([], CONTEXT_EMPTY);
    } catch (err) {
      errMessage = err.message;
    }

    assert.deepStrictEqual(errMessage, `Cannot re-assign a constant: 'c'`);
  });

  it('default globals are not overridden when assigned', function () {
    assert.deepStrictEqual(esEval('(() => { undefined = "custom"; return undefined })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { NaN = "custom"; return NaN })()'), NaN);
    assert.deepStrictEqual(esEval('(() => { Infinity = "custom"; return Infinity })()'), Infinity);
  });

  it('default globals can be redefined', function () {
    // const
    assert.deepStrictEqual(esEval('(() => { const undefined = "custom"; return undefined })()'), 'custom');
    assert.deepStrictEqual(esEval('(() => { const NaN = "custom"; return NaN })()'), 'custom');
    assert.deepStrictEqual(esEval('(() => { const Infinity = "custom"; return Infinity })()'), 'custom');

    // let
    assert.deepStrictEqual(esEval('(() => { const undefined = "custom"; return undefined })()'), 'custom');
    assert.deepStrictEqual(esEval('(() => { const NaN = "custom"; return NaN })()'), 'custom');
    assert.deepStrictEqual(esEval('(() => { const Infinity = "custom"; return Infinity })()'), 'custom');
  });

  it('default globals are overridden when assigned if they were redefined', function () {
    // Without initialization
    assert.deepStrictEqual(esEval('(() => { let undefined; undefined = 7; return undefined })()'), 7);
    assert.deepStrictEqual(esEval('(() => { let NaN; NaN = 7; return NaN })()'), 7);
    assert.deepStrictEqual(esEval('(() => { let Infinity; Infinity = 7; return Infinity })()'), 7);

    // With initialization
    assert.deepStrictEqual(esEval('(() => { let undefined = "custom"; undefined = 7; return undefined })()'), 7);
    assert.deepStrictEqual(esEval('(() => { let NaN = "custom"; NaN = 7; return NaN })()'), 7);
    assert.deepStrictEqual(esEval('(() => { let Infinity = "custom"; Infinity = 7; return Infinity })()'), 7);
  });

  it('property assignment', function () {
    // Object property assignment
    assert.deepStrictEqual(esEval('(() => { let x = {}; x.a = 20; return [x, x.a]; })()'), [{ a: 20 }, 20]);
    assert.deepStrictEqual(esEval('(() => { let obj = { a: null, b: 100 }; obj.a = 20, obj.b = obj.a + obj.b; obj.c = obj.a; return obj; })()'), {a: 20, b: 120, c: 20});

    // Other types
    assert.deepStrictEqual(esEval('(() => { let x = 5; x.a = 20; return [x, x.a]; })()'), [5, void 0]);
    assert.deepStrictEqual(esEval('(() => { let x = NaN; x.a = 20; return [x, x.a]; })()'), [NaN, void 0]);
    assert.deepStrictEqual(esEval('(() => { let x = Infinity; x.a = 20; return [x, x.a]; })()'), [Infinity, void 0]);
    assert.deepStrictEqual(esEval('(() => { let x = true; x.a = 20; return [x, x.a]; })()'), [true, void 0]);
    assert.deepStrictEqual(esEval('(() => { let x = false; x.a = 20; return [x, x.a]; })()'), [false, void 0]);
    assert.deepStrictEqual(esEval('(() => { let x = "str"; x.a = 20; return [x, x.a]; })()'), ['str', void 0]);
    assert.deepStrictEqual(esEval('(() => { let x = "str"; x.a = 20; return [x, x.a]; })()'), ['str', void 0]);

    // Array string property
    const result = esEval('(() => { let x = []; x.a = 20; return [x, x.a]; })()');
    assert(Array.isArray(result[0]));
    assert.deepStrictEqual(result[0].length, 0);
    assert.deepStrictEqual(result[0].a, 20);
    assert.deepStrictEqual(result[1], 20);
    // assert.deepStrictEqual(esEval('(() => { let x = y=>y; x.a = 20; return [x, x.a]; })()'), ['str', void 0]); // @todo(feat) support property read/write on functions

    // Error cases
    assertError(() => esEval('null.a = 1'), "Cannot set properties of null (setting 'a')");
    assertError(() => esEval('undefined.a = 1'), "Cannot set properties of undefined (setting 'a')");
    assertError(() => esEval('(() => { let x; x.prop = 20; })()'), "Cannot set properties of undefined (setting 'prop')");
  });
});
