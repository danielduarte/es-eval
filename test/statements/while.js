const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Statements - while', function () {

  it('while - empty loop', function () {
    assert.deepStrictEqual(esEval('(() => { while (false); })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { while (false) {} })()'), void 0);
  });

  it('while - simple loop', function () {
    const exp = `(() => {
      let loop = true;
      while (loop) loop = false;
      return loop;
    })()`;

    assert.deepStrictEqual(esEval(exp), false);
  });

  it('while - body with return and truthy condition', function () {
    const exp = `(() => {
      while (true) {
        return 123;
      }
    })()`;

    assert.deepStrictEqual(esEval(exp), 123);
  });

  it('while - body with return and falsy condition', function () {
    const exp = `(() => {
      let loop = true;
      while (loop) {
        loop = false;
        return 123;
      }
      return 321;
    })()`;

    assert.deepStrictEqual(esEval(exp), 123);
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

  it('while - array iteration with return', function () {
    const exp = `(() => {
      const array = ['a', 'b', 'c'], result = [];
      let i = 1;
      while (i <= array.length) {
        if (array[i - 1] === 'c') {
          return result;
        }
        result.push(array[i - 1] + '-' + i);
        i = i + 1;
      }
      return result;
    })()`;

    assert.deepStrictEqual(esEval(exp), ['a-1', 'b-2']);
  });

  it('while - array iteration with conditional return', function () {
    const exp = `(() => {
      let i = 0;
      while (i < 10) {
        if (i === 3) {
          return i;
        }
        i = i + 1;
      }
      return i;
    })()`;

    assert.deepStrictEqual(esEval(exp), 3);
  });
});
