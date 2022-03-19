const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('General', function () {
  // @todo(feat) check if should support a global object
  it('global this - set as undefined in this implementation', function () {
    const globalThis = {};
    assert.deepStrictEqual(esEval('this'), globalThis);
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
