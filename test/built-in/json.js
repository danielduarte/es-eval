const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { assertError, getMajorNodeVersion } = require('../utils');

describe('Built-in JSON object', function () {

  it('JSON object exists and is valid', function () {
    assert.deepStrictEqual(esEval('typeof JSON'), 'object');
  });

  // @todo(feat) improve JSON support
  // it('JSON object can be overridden', function () {
  //   assert.deepStrictEqual(esEval('JSON = 33, JSON'), 33); // @todo(feat) support override entire JSON
  //   assert.deepStrictEqual(esEval('JSON.prop = 2, JSON.prop'), 2);
  //   assert.deepStrictEqual(esEval('JSON.parse = () => "the cake is a lie", JSON.parse("{}")'), 'the cake is a lie');
  // });

  it('JSON.parse', function () {
    const nodeVersion = getMajorNodeVersion();

    assert.deepStrictEqual(esEval('typeof JSON.parse'), 'function');

    // Number
    assert.deepStrictEqual(esEval('JSON.parse(0)'), 0);
    assert.deepStrictEqual(esEval('JSON.parse(1234)'), 1234);
    if (nodeVersion < 19) {
      assertError(() => esEval('JSON.parse(Infinity)'), 'Unexpected token I in JSON at position 0');
      assertError(() => esEval('JSON.parse(NaN)'), 'Unexpected token N in JSON at position 0');
    } else {
      assertError(() => esEval('JSON.parse(Infinity)'), '"Infinity" is not valid JSON');
      assertError(() => esEval('JSON.parse(NaN)'), '"NaN" is not valid JSON');
    }

    // Undefined
    const jsonParseUndefError = nodeVersion < 19 ? 'Unexpected token u in JSON at position 0' : '"undefined" is not valid JSON';
    assertError(() => esEval('JSON.parse(undefined)'), jsonParseUndefError);

    // Boolean
    assert.deepStrictEqual(esEval('JSON.parse(false)'), false);
    assert.deepStrictEqual(esEval('JSON.parse(true)'), true);

    // Object
    const jsonParseObjError = nodeVersion < 19 ? 'Unexpected token o in JSON at position 1' : '"[object Object]" is not valid JSON';
    assertError(() => esEval('JSON.parse({})'), jsonParseObjError);
    assertError(() => esEval('JSON.parse({ a: 1 })'), jsonParseObjError);
    assertError(() => esEval('JSON.parse({ "a": 1 })'), jsonParseObjError);
    assert.deepStrictEqual(esEval('JSON.parse(null)'), null);
    // assert.deepStrictEqual(esEval('JSON.parse({ a: 1, toString() { return 4321; } })'), 4321); // @todo(feat) support toString when parsing JSON

    // Array
    assertError(() => esEval('JSON.parse([])'), 'Unexpected end of JSON input');
    if (nodeVersion < 19) {
      assertError(() => esEval('JSON.parse([1, 2, 3])'), 'Unexpected token , in JSON at position 1');
    } else if (nodeVersion === 20) {
      assertError(() => esEval('JSON.parse([1, 2, 3])'), 'Unexpected non-whitespace character after JSON at position 1');
    } else {
      assertError(() => esEval('JSON.parse([1, 2, 3])'), 'Unexpected non-whitespace character after JSON at position 1 (line 1 column 2)');
    }

    // String
    assertError(() => esEval('JSON.parse("")'), 'Unexpected end of JSON input');
    assertError(() => esEval('JSON.parse("hello")'), nodeVersion < 19 ? 'Unexpected token h in JSON at position 0' : `Unexpected token 'h', "hello" is not valid JSON`);
    assert.deepStrictEqual(esEval('JSON.parse("0")'), 0);
    assert.deepStrictEqual(esEval('JSON.parse("1234")'), 1234);
    assertError(() => esEval('JSON.parse("Infinity")'),  nodeVersion < 19 ? 'Unexpected token I in JSON at position 0' : '"Infinity" is not valid JSON' );
    assertError(() => esEval('JSON.parse("NaN")'), nodeVersion < 19 ? 'Unexpected token N in JSON at position 0' : '"NaN" is not valid JSON');
    assertError(() => esEval('JSON.parse("undefined")'), nodeVersion < 19 ? 'Unexpected token u in JSON at position 0' : '"undefined" is not valid JSON');
    assert.deepStrictEqual(esEval('JSON.parse("false")'), false);
    assert.deepStrictEqual(esEval('JSON.parse("true")'), true);
    assertError(() => esEval(`JSON.parse("''")`), nodeVersion < 19 ? `Unexpected token ' in JSON at position 0` : `Unexpected token ''', "''" is not valid JSON`);
    assert.deepStrictEqual(esEval(`JSON.parse('""')`), '');
    assert.deepStrictEqual(esEval(`JSON.parse('"hello"')`), 'hello');
    assertError(() => esEval(`JSON.parse("'hello'")`), nodeVersion < 19 ? `Unexpected token ' in JSON at position 0` : `Unexpected token ''', "'hello'" is not valid JSON`);
    assert.deepStrictEqual(esEval(`JSON.parse('{}')`), {});
    assert.deepStrictEqual(esEval('JSON.parse("null")'), null);
    assert.deepStrictEqual(esEval(`JSON.parse('{ "a": 1 }')`), { a: 1 });
    assertError(() => esEval(`JSON.parse('{ "a": undefined }')`), nodeVersion < 19 ? 'Unexpected token u in JSON at position 7' : `Unexpected token 'u', "{ "a": undefined }" is not valid JSON`);
    assert.deepStrictEqual(esEval(`JSON.parse('{ "a": false }')`), { a: false });
    assert.deepStrictEqual(esEval(`JSON.parse('{ "a": true }')`), { a: true });
    assert.deepStrictEqual(esEval(`JSON.parse('{ "a": "test" }')`), { a: 'test' });
    assert.deepStrictEqual(esEval(`JSON.parse('{ "a": 1, "b": 2, "c": 3 }')`), { a: 1, b: 2, c: 3 });
    assert.deepStrictEqual(esEval(`JSON.parse('{ "a": null }')`), { a: null });
    assert.deepStrictEqual(esEval('JSON.parse("[]")'), []);
    assert.deepStrictEqual(esEval('JSON.parse("[1, 2, 3]")'), [1, 2, 3]);
    assert.deepStrictEqual(esEval(`JSON.parse('[123, true, false, "", { "a": 1 }, [1, 2, 3, []], null]')`), [123, true, false, '', { a: 1 }, [1, 2, 3, []], null]);
    assert.deepStrictEqual(esEval(`JSON.parse('{"a":1,"b":2,"c":[3,4,{"d":5,"e":6},7]}')`), { a: 1, b: 2, c: [3, 4, { d: 5, e: 6 }, 7] });
    assert.deepStrictEqual(esEval(`JSON.parse('{"a":1,"b":2,"c":[3,4,{"d":5,"e":6},7]}', (k, v) => typeof v === 'number' ? v * 10 : v)`), { a: 10, b: 20, c: [30, 40, { d: 50, e: 60 }, 70] });
  });

  it('JSON.stringify', function () {
    assert.deepStrictEqual(esEval('typeof JSON.stringify'), 'function');

    // Objects
    assert.deepStrictEqual(esEval('JSON.stringify({})'), '{}');
    assert.deepStrictEqual(esEval('JSON.stringify({ x: 5, y: 6 })'), '{"x":5,"y":6}');

    // Functions
    assert.deepStrictEqual(esEval('JSON.stringify({ a: 1, b: x => 6 })'), '{"a":1}');

    // toJSON
    assert.deepStrictEqual(esEval('JSON.stringify({ a: 1, toJSON: x => 6 })'), '6');
    assert.deepStrictEqual(esEval('JSON.stringify({ a: 1, toJSON: 6 })'), '{"a":1,"toJSON":6}');

    // Booleans
    assert.deepStrictEqual(esEval('JSON.stringify(true)'), 'true');

    // Strings
    assert.deepStrictEqual(esEval('JSON.stringify("foo")'), '"foo"');

    // Arrays
    assert.deepStrictEqual(esEval('JSON.stringify([1, "false", false])'), '[1,"false",false]');
    assert.deepStrictEqual(esEval('JSON.stringify([NaN, null, Infinity])'), '[null,null,null]');
    assert.deepStrictEqual(esEval('(() => { let a = ["foo", "bar"]; a["baz"] = "quux"; return JSON.stringify(a); })()'), '["foo","bar"]'); // String-keyed array elements are not enumerable and make no sense in JSON

    // @todo(feat) uncomment when 'new' keyword is supported
    // assert.deepStrictEqual(esEval('JSON.stringify(new Date(2006, 0, 2, 15, 4, 5))'), '"2006-01-02T15:04:05.000Z"');
    // assert.deepStrictEqual(esEval('JSON.stringify([new Number(3), new String("false"), new Boolean(false)])'), '[3,"false",false]');
    // assert.deepStrictEqual(esEval('JSON.stringify([new Set([1]), new Map([[1, 2]]), new WeakSet([{a: 1}]), new WeakMap([[{a: 1}, 2]])])'), '[{},{},{},{}]');
    // assert.deepStrictEqual(esEval('JSON.stringify([new Int8Array([1]), new Int16Array([1]), new Int32Array([1])])'), '[{"0":1},{"0":1},{"0":1}]');
    // assert.deepStrictEqual(esEval('JSON.stringify([new Uint8Array([1]), new Uint8ClampedArray([1]), new Uint16Array([1]), new Uint32Array([1])])'), '[{"0":1},{"0":1},{"0":1},{"0":1}]');
    // assert.deepStrictEqual(esEval('JSON.stringify([new Float32Array([1]), new Float64Array([1])])'), '[{"0":1},{"0":1}]');

    // @todo(feat) uncomment when 'Symbol' type is supported
    // assert.deepStrictEqual(esEval('JSON.stringify({ x: [10, undefined, function() {}, Symbol("")] })'), '{"x":[10,null,null,null]}');
    // assert.deepStrictEqual(esEval('JSON.stringify({ x: undefined, y: Object, z: Symbol("") })'), '{}');
    // assert.deepStrictEqual(esEval('JSON.stringify({ [Symbol("foo")]: "foo" })'), '{}');
    // assert.deepStrictEqual(esEval('JSON.stringify({ [Symbol.for("foo")]: "foo" }, [Symbol.for("foo")])'), '{}');
    // assert.deepStrictEqual(esEval('JSON.stringify({ [Symbol.for("foo")]: "foo" }, function(k, v) { if (typeof k === "symbol") { return "a symbol"; } })'), void 0);

    // @todo(feat) uncomment when methods syntax is supported
    // assert.deepStrictEqual(esEval('JSON.stringify({ x: 5, y: 6, toJSON() { return this.x + this.y; } })'), '11');

    // @todo(feat) uncomment when Object.create is supported
    // assert.deepStrictEqual(esEval('JSON.stringify(Object.create(null, { x: { value: "x", enumerable: false }, y: { value: "y", enumerable: true } }))'), '{"y":"y"}');

    // @todo(feat) uncomment when BigInt is supported
    // esEval('JSON.stringify({x: 2n})'); // TypeError: BigInt value can't be serialized in JSON
  });
});
