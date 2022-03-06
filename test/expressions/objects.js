const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Objects', function () {

  it('object with literal keys', function () {
    assert.deepStrictEqual(esEval('{ "a": 1 }'), { a: 1 });
    assert.deepStrictEqual(esEval("{ 'a': 1 }"), { a: 1 });
    // assert.deepStrictEqual(esEval('{ `a`: 1 }'), { a: 1 }); // @todo do not support string templates as object keys (add test)
    assert.deepStrictEqual(esEval('{ 5: 1 }'), { 5: 1 });
    assert.deepStrictEqual(esEval('{ "5": 1 }'), { 5: 1 });
    assert.deepStrictEqual(esEval('{ undefined: 1 }'), { 'undefined': 1 });
    assert.deepStrictEqual(esEval('{ NaN: 1 }'), { 'NaN': 1 });
    assert.deepStrictEqual(esEval('{ Infinity: 1 }'), { 'Infinity': 1 });
    assert.deepStrictEqual(esEval('{ null: 1 }'), { 'null': 1 });
  });

  it('object with computed keys', function () {
    assert.deepStrictEqual(esEval('{ ["i" + "d"]: 123 }'), { id: 123 });
    assert.deepStrictEqual(esEval('{ [2**4 + (1 - 7)]: 123 }'), { 10: 123 });
    assert.deepStrictEqual(esEval('(() => { const prop = "field"; return { [prop]: 123 }; })()'), { field: 123 });
    assert.deepStrictEqual(esEval('{ [undefined]: 1 }'), { 'undefined': 1 });
    assert.deepStrictEqual(esEval('{ [32]: 1 }'), { '32': 1 });
    assert.deepStrictEqual(esEval('{ [NaN]: 1 }'), { 'NaN': 1 });
    assert.deepStrictEqual(esEval('{ [Infinity]: 1 }'), { 'Infinity': 1 });
    assert.deepStrictEqual(esEval('{ [null]: 1 }'), { 'null': 1 });
  });

  it('nested objects', function () {
    const obj = {
      id: 1234,
      address: { street: { name: 'Fake St', num: 1234 }, cp: 7000 },
      name: { first: 'Dani', last: 'Duarte' }
    };

    const objStr = `{
      id: 1234,
      address: { street: { name: 'Fake St', num: 1234 }, cp: 7000 },
      name: { first: 'Dani', last: 'Duarte' }
    }`;

    assert.deepStrictEqual(esEval(objStr), obj);
    assert.deepStrictEqual(esEval(JSON.stringify(obj)), obj);
  });

  it('can access a property (literal object, not computed property)', function () {
    assert.deepStrictEqual(esEval('({ a: 123 }).a' ), 123);
    assert.deepStrictEqual(esEval('({ undefined: 123 }).undefined' ), 123);
    assert.deepStrictEqual(esEval('({ NaN: 123 }).NaN' ), 123);
    assert.deepStrictEqual(esEval('({ Infinity: 123 }).Infinity' ), 123);
    assert.deepStrictEqual(esEval('({ null: 123 }).null' ), 123);
  });

  it('can access a property (literal object, computed property)', function () {
    assert.deepStrictEqual(esEval('({ a: 123 })["a"]' ), 123);
    assert.deepStrictEqual(esEval('({ a12: 123 })["a" + 12]' ), 123);
    assert.deepStrictEqual(esEval('({ undefined: 123 })[undefined]' ), 123);
    assert.deepStrictEqual(esEval('({ NaN: 123 })[NaN]' ), 123);
    assert.deepStrictEqual(esEval('({ Infinity: 123 })[Infinity]' ), 123);
    assert.deepStrictEqual(esEval('({ null: 123 })[null]' ), 123);
  });

  it('can access a property (computed object, not computed property)', function () {
    assert.deepStrictEqual(esEval('(() => ({ a: 123 }))().a' ), 123);
  });

  it('can set a property', function () {
    assert.deepStrictEqual(esEval('({}).prop = 4' ), 4);
  });
});
