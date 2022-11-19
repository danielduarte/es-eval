const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { assertError } = require('../utils');

describe('Statements - for of', function () {

  it('for of - empty loop', function () {
    assert.deepStrictEqual(esEval('(() => { for (const x of []); })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { for (const x of [1, 2, 3]); })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { for (const x of []) {} })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { for (const x of [1, 2, 3]) {} })()'), void 0);
  });


  it('for of - body with return', function () {
    const exp = `(() => {

      const loopResult = (function () {
        const elems = [];
        for (const i of [1, 2, 3]) {
          elems.push(i);
          return { message: 'it works!', elems: elems }
        }
        return { message: 'it does not work', elems: elems };
      })();

      return loopResult;
    })()`;

    assert.deepStrictEqual(esEval(exp), { message: 'it works!', elems: [1]});
  });

  it('for of - array iteration', function () {
    const exp = `(() => {
      const array = ['a', 'b', 'c'], result = [];
      let i = 1;
      for (const x of array) {
        result.push(x + '-' + i);
        i = i + 1;
      }
      return result;
    })()`;

    assert.deepStrictEqual(esEval(exp), ['a-1', 'b-2', 'c-3']);
  });

  it('for of - declaration scope (const)', function () {
    const exp = `(() => {
      const array = ['a', 'b', 'c'], result = [];
      for (const x of array) {
        result.push(x + '!');
      }
      return { result: result, x: x };
    })()`;

    assertError(() => esEval(exp), "Identifier not defined: 'x'");
  });

  it('for of - declaration scope (let)', function () {
    const exp = `(() => {
      const array = ['a', 'b', 'c'], result = [];
      for (let x of array) {
        result.push(x + '!');
      }
      return { result: result, x: x };
    })()`;

    assertError(() => esEval(exp), "Identifier not defined: 'x'");
  });

  // @todo Not supported yet
  // it('for of - const already declared', function () {
  //   const exp = `(() => {
  //     const array = ['a', 'b', 'c'], result = [];
  //     const x = 'z';
  //     for (x of array) {
  //       result.push(x + '!');
  //     }
  //     return { result, x };
  //   })()`;

  //   assert.deepStrictEqual(esEval(exp), { result: ['a-1', 'b-2', 'c-3'], x: 'c' });
  // });

  // @todo Not supported yet
  // it('for of - let already declared', function () {
  //   const exp = `(() => {
  //     const array = ['a', 'b', 'c'], result = [];
  //     let x = 'z';
  //     for (x of array) {
  //       result.push(x + '!');
  //     }
  //     return { result, x };
  //   })()`;

  //   assert.deepStrictEqual(esEval(exp), { result: ['a-1', 'b-2', 'c-3'], x: 'c' });
  // });
});
