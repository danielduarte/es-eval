const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Closures', function () {
  it('can create closures', function () {
    assert.deepStrictEqual(esEval(`
      (() => {
        const createAdder = increment => {
          return x => x + increment;
        };
        const inc = createAdder(1);
        return inc(1000);
      })()
    `), 1001);
  });
});
