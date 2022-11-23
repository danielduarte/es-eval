const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { CONTEXT_EMPTY, ID_UNDEFINED, ID_INFINITY, ID_NAN } = require('../../lib/context/defaults');

describe('General', function () {

  it('global this - empty context', function () {
    const globalThis = {};
    assert.deepStrictEqual(esEval('this', null, { context: CONTEXT_EMPTY }), globalThis);
  });

  it('global this - default context', function () {
    const expectedThisKeys = [
        // Special identifiers
        ID_UNDEFINED,
        ID_INFINITY,
        ID_NAN,

        // globalThis global object
        'globalThis',

        // Global functions
        'isFinite',
        'isNaN',
        'parseFloat',
        'parseInt',

        // JSON global object
        'JSON',

        // Math global object
        'Math',

        // Object global constructor
        'Object',
        'Array',
    ];
    const thisKeys = Object.keys(esEval('this'));
    assert.deepStrictEqual(thisKeys, expectedThisKeys);
  });

  it('global this - optional this in global fields', function () {
    assert.deepStrictEqual(esEval('this.undefined'),  esEval('undefined'));
    assert.deepStrictEqual(esEval('this.Infinity'),   esEval('Infinity'));
    assert.deepStrictEqual(esEval('this.NaN'),        esEval('NaN'));
    // assert.deepStrictEqual(esEval('this.globalThis'), esEval('globalThis')); // @todo support globalThis
    // assert.deepStrictEqual(esEval('this.isFinite'),   esEval('isFinite'));      // @todo support global functions referenced by this
    // assert.deepStrictEqual(esEval('this.isNaN'),      esEval('isNaN'));      // @todo support global functions referenced by this
    // assert.deepStrictEqual(esEval('this.parseFloat'), esEval('parseFloat')); // @todo support global functions referenced by this
    // assert.deepStrictEqual(esEval('this.parseInt'),   esEval('parseInt'));   // @todo support global functions referenced by this
    assert.deepStrictEqual(esEval('this.JSON'),       esEval('JSON'));
    assert.deepStrictEqual(esEval('this.Math'),       esEval('Math'));
    assert.deepStrictEqual(esEval('this.Object'),     esEval('Object'));
  });


  // @todo support globalThis
  // it('globalThis', function () {
  //   assert.deepStrictEqual(esEval('this'),  esEval('globalThis'));
  //   assert.deepStrictEqual(esEval('this'),  esEval('globalThis.globalThis'));
  //   assert.deepStrictEqual(esEval('this'),  esEval('this.globalThis'));
  //   assert.deepStrictEqual(esEval('this'),  esEval('this.globalThis.globalThis'));
  // });

  it('this on function expressions', function () {
    const exp = `
      (() => {
        const obj = {
          prop: 'value',
          method: function () {
            return this.prop + '!';
          },
        };
        return obj.method();
      })()
    `;
    assert.deepStrictEqual(esEval(exp), 'value!');
  });

  it('this on arrow function expressions', function () {
    const exp = `
      (() => {
        const obj = {
          prop: 'value',
          method: () => {
            return this.prop + '!';
          },
        };
        return obj.method();
      })()
    `;
    assert.deepStrictEqual(esEval(exp), 'undefined!');
  });
});
