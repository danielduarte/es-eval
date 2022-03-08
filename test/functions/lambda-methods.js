const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Arrow methods', function () {

  it('method call', function () {
    const exp = `
      (() => {
        return {
          method: () => 3.14
        };
      })().method()
    `;

    assert.deepStrictEqual(esEval(exp), 3.14);
  });
});
