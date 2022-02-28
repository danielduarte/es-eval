const assert = require('assert');
const esEval = require('../..');

describe('Arrow functions', function () {

  it('empty lambda', function () {
    assert.deepStrictEqual(esEval('() => {}').exec([]), void 0);
  });

  it('literal lambdas', function () {
    assert.deepStrictEqual(esEval('() => 1234').exec([]), 1234);
    assert.deepStrictEqual(esEval('() => undefined').exec([]), void 0);
    assert.deepStrictEqual(esEval('() => false').exec([]), false);
    assert.deepStrictEqual(esEval('() => true').exec([]), true);
  });
});
