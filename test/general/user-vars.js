const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('User variables', function () {

  it('user variables are read and written', function () {
    assert.deepStrictEqual(esEval('x', { x: 54321 }), 54321);
    assert.deepStrictEqual(esEval('x', { x: [1, 2, 3, 4] }), [1, 2, 3, 4]);
    assert.deepStrictEqual(esEval('x.length', { x: [1, 2, 3, 4] }), 4);
    assert.deepStrictEqual(esEval('x = x', { x: 54321 }), 54321);
    assert.deepStrictEqual(esEval('x = 888', { x: 54321 }), 888);
    assert.deepStrictEqual(esEval('(() => { const oldX = x; x = 888; return { oldX: oldX, newX: x }; })()', { x: 777 }), { oldX: 777, newX: 888 });
  });

  it('unknown variables are reported', function () {
    let errMessage = 'NO ERROR';
    try {
      esEval('z');
    } catch (err) {
      errMessage = err.message;
    }
    assert.deepStrictEqual(errMessage, `Identifier not defined: 'z'`);

    errMessage = 'NO ERROR';
    try {
      esEval('x + y + z', { x: 1, z: 3 });
    } catch (err) {
      errMessage = err.message;
    }
    assert.deepStrictEqual(errMessage, `Identifier not defined: 'y'`);
  });

  it('can eval without providing user vars', function () {
    assert.deepStrictEqual(esEval('1 + 10'), 11);
    assert.deepStrictEqual(esEval('1 + 10', {}), 11);
  });

  it('default globals are available when user provide vars', function () {
    assert.deepStrictEqual(esEval('undefined', { x: 1 }), void 0);
    assert.deepStrictEqual(esEval('NaN', { x: 1 }), NaN);
    assert.deepStrictEqual(esEval('Infinity', { x: 1 }), Infinity);
  });

  it('default globals are hidden when user provide them with custom values', function () {
    assert.deepStrictEqual(esEval('undefined', { 'undefined': 'my custom undefined' }), 'my custom undefined');
    assert.deepStrictEqual(esEval('NaN', { 'NaN': 'my custom NaN' }), 'my custom NaN');
    assert.deepStrictEqual(esEval('Infinity', { 'Infinity': 'my custom Infinity' }), 'my custom Infinity');
  });
});
