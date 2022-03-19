const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Statements - blocks', function () {

  it('empty block', function () {
    assert.deepStrictEqual(esEval('(() => { {} })()'), void 0);
  });

  it('empty sibling blocks', function () {
    assert.deepStrictEqual(esEval('(() => { {}{}{} })()'), void 0);
  });

  it('empty nested blocks', function () {
    assert.deepStrictEqual(esEval('(() => { {{{}}} })()'), void 0);
  });

  it('single block', function () {
    assert.deepStrictEqual(esEval('(() => { let x = 1; { x = 2 } return x; })()'), 2);
  });

  // @todo(chore) check variables scope inside blocks
  it('nested blocks', function () {
    const exp = `(() => {
      const results = [];

      results.push(1);
      {
        results.push(2);
        {
          results.push(3);
          {
            results.push(4);
          }
          {
            results.push(5);
          }
          results.push(6);
        }
        results.push(7);
      }
      results.push(8);

      return results;
    })()`;

    assert.deepStrictEqual(esEval(exp), [1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('nested blocks with return', function () {
    const exp = `(() => {
      const results = [];

      results.push(1);
      {
        results.push(2);
        {
          results.push(3);
          {
            results.push(4);
          }
          {
            return results;
            results.push(5);
          }
          results.push(6);
        }
        results.push(7);
      }
      results.push(8);

      return results;
    })()`;

    assert.deepStrictEqual(esEval(exp), [1, 2, 3, 4]);
  });
});
