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
        'isNaN',
        'parseFloat',
        'parseInt',

        // JSON global object
        'JSON',

        // Math global object
        'Math',

        // Object global constructor
        'Object',
    ];
    const thisKeys = Object.keys(esEval('this'));
    assert.deepStrictEqual(thisKeys, expectedThisKeys);
  });

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
