const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Methods', function () {

  it('method call', function () {
    const exp = `
      (() => {
        return {
          method: function () { return 3.14; }
        };
      })().method()
    `;

    assert.deepStrictEqual(esEval(exp), 3.14);
  });
});
