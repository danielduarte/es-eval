const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Statements - while', function () {

  it('while - simple loop', function () {
    const exp = `(() => {
      let loop = true;
      while (loop) loop = false;
      return loop;
    })()`;

    assert.deepStrictEqual(esEval(exp), false);
  });

  it('while - array iteration', function () {
    const exp = `(() => {
      const array = ['a', 'b', 'c'], result = [];
      let i = 1;
      while (i <= array.length) {
        result.push(array[i - 1] + '-' + i);
        i = i + 1;
      }
      return result;
    })()`;

    assert.deepStrictEqual(esEval(exp), ['a-1', 'b-2', 'c-3']);
  });
});
