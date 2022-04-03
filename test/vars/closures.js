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

    assert.deepStrictEqual(esEval(`
      ((base) => {
        const createAdder = num => {
          return x => x + num + base;
        };
        const inc = createAdder(1);
        const dec = createAdder(-1);
        return [inc(inc(1000)), dec(1000)];
      })(1000000)
    `), [2001002, 1000999]);
  });
});
