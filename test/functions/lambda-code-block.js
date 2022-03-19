const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { CONTEXT_DEFAULT, CONTEXT_EMPTY } = require('../../lib/context/defaults');

describe('Arrow functions - return statement', function () {

  it('lambda with code block - empty statement', function () {
    assert.deepStrictEqual(esEval('() => { ; }').exec([], CONTEXT_EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { ;;;; }').exec([], CONTEXT_EMPTY), void 0);
  });

  it('lambda with code block - empty return only body', function () {
    assert.deepStrictEqual(esEval('() => { return; }').exec([], CONTEXT_EMPTY), void 0);
  });

  it('lambda with code block - return literal only body', function () {
    assert.deepStrictEqual(esEval('() => { return 1234; }').exec([], CONTEXT_EMPTY), 1234);
    assert.deepStrictEqual(esEval('() => { return undefined; }').exec([], CONTEXT_DEFAULT), void 0);
    assert.deepStrictEqual(esEval('() => { return NaN; }').exec([], CONTEXT_DEFAULT), NaN);
    assert.deepStrictEqual(esEval('() => { return Infinity; }').exec([], CONTEXT_DEFAULT), Infinity);
    assert.deepStrictEqual(esEval('() => { return false; }').exec([], CONTEXT_EMPTY), false);
    assert.deepStrictEqual(esEval('() => { return true; }').exec([], CONTEXT_EMPTY), true);
    assert.deepStrictEqual(esEval('() => { return ""; }').exec([], CONTEXT_EMPTY), '');
    assert.deepStrictEqual(esEval('() => { return "XYZ"; }').exec([], CONTEXT_EMPTY), 'XYZ');
    assert.deepStrictEqual(esEval('() => { return {}; }').exec([], CONTEXT_EMPTY), {});
    assert.deepStrictEqual(esEval('() => { return []; }').exec([], CONTEXT_EMPTY), []);
    assert.deepStrictEqual(esEval('() => { return null; }').exec([], CONTEXT_EMPTY), null);
  });

  it('lambda with code block - multiple return', function () {
    assert.deepStrictEqual(esEval('() => { return 11; return 22; return 33; }').exec([], CONTEXT_EMPTY), 11);
  });

  it('lambda with code block - no return returns undefined', function () {
    assert.deepStrictEqual(esEval('() => { 5 }').exec([], CONTEXT_EMPTY), void 0);
  });

  it('lambda function - passing a callback parameter', function () {
    const exp = `
      (() => {
        const out = [];

        const callback = () => {
          out.push('callback called!');
        };

        const main = (param, cb) => {
          out.push('started main with ' + param);
          cb();
          out.push('finished main');
        };

        main('main value', callback);

        return out;
      })()
    `;

    assert.deepStrictEqual(esEval(exp), [
      'started main with main value',
      'callback called!',
      'finished main'
    ]);
  });
});
