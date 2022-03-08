const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Arrow functions - return statement', function () {

  it('lambda with code block - empty statement', function () {
    assert.deepStrictEqual(esEval('() => { ; }').exec([], Context.EMPTY), void 0);
    assert.deepStrictEqual(esEval('() => { ;;;; }').exec([], Context.EMPTY), void 0);
  });

  it('lambda with code block - empty return only body', function () {
    assert.deepStrictEqual(esEval('() => { return; }').exec([], Context.EMPTY), void 0);
  });

  it('lambda with code block - return literal only body', function () {
    assert.deepStrictEqual(esEval('() => { return 1234; }').exec([], Context.EMPTY), 1234);
    assert.deepStrictEqual(esEval('() => { return undefined; }').exec([], Context.DEFAULT), void 0);
    assert.deepStrictEqual(esEval('() => { return NaN; }').exec([], Context.DEFAULT), NaN);
    assert.deepStrictEqual(esEval('() => { return Infinity; }').exec([], Context.DEFAULT), Infinity);
    assert.deepStrictEqual(esEval('() => { return false; }').exec([], Context.EMPTY), false);
    assert.deepStrictEqual(esEval('() => { return true; }').exec([], Context.EMPTY), true);
    assert.deepStrictEqual(esEval('() => { return ""; }').exec([], Context.EMPTY), '');
    assert.deepStrictEqual(esEval('() => { return "XYZ"; }').exec([], Context.EMPTY), 'XYZ');
    assert.deepStrictEqual(esEval('() => { return {}; }').exec([], Context.EMPTY), {});
    assert.deepStrictEqual(esEval('() => { return []; }').exec([], Context.EMPTY), []);
    assert.deepStrictEqual(esEval('() => { return null; }').exec([], Context.EMPTY), null);
  });

  it('lambda with code block - multiple return', function () {
    assert.deepStrictEqual(esEval('() => { return 11; return 22; return 33; }').exec([], Context.EMPTY), 11);
  });

  it('lambda with code block - no return returns undefined', function () {
    assert.deepStrictEqual(esEval('() => { 5 }').exec([], Context.EMPTY), void 0);
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
