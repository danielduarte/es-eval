const assert = require('assert');
const esEval = require('../..');

describe('Nested expressions', function () {

  it('single 1 level', function () {
    assert.deepStrictEqual(esEval('(6)'), 6);
    assert.deepStrictEqual(esEval('(undefined)'), void 0);
    assert.deepStrictEqual(esEval('(true)'), true);
    assert.deepStrictEqual(esEval('(false)'), false);
    assert.deepStrictEqual(esEval("('')"), '');
    assert.deepStrictEqual(esEval('("")'), '');
    assert.deepStrictEqual(esEval('("test")'), 'test');
    // @todo Add support for template strings
    // assert.deepStrictEqual(esEval("(``)"), '');
    assert.deepStrictEqual(esEval('({})'), {});
  });

  it('single multi level', function () {
    assert.deepStrictEqual(esEval('(((((6)))))'), 6);
    assert.deepStrictEqual(esEval('(((((undefined)))))'), void 0);
    assert.deepStrictEqual(esEval('(((((true)))))'), true);
    assert.deepStrictEqual(esEval('(((((false)))))'), false);
    assert.deepStrictEqual(esEval("((((('')))))"), '');
    assert.deepStrictEqual(esEval('((((("")))))'), '');
    assert.deepStrictEqual(esEval('((((("test")))))'), 'test');
    // @todo Add support for template strings
    // assert.deepStrictEqual(esEval("(((((``)))))"), '');
    assert.deepStrictEqual(esEval('((((({})))))'), {});
  });


  it('associative', function () {
    assert.deepStrictEqual(esEval('1 - 2 - 3'), -4);
    assert.deepStrictEqual(esEval('(1 - 2) - 3'), -4);
    assert.deepStrictEqual(esEval('1 - (2 - 3)'), 2);
  });
});
