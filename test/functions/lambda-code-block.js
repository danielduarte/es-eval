const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Arrow functions - return statement', function () {

  it('lambda with code block - empty statement', function () {
    assert.deepStrictEqual(esEval('() => { ; }').exec([]), void 0);
    assert.deepStrictEqual(esEval('() => { ;;;; }').exec([]), void 0);
  });

  it('lambda with code block - empty return only body', function () {
    assert.deepStrictEqual(esEval('() => { return; }').exec([]), void 0);
  });

  it('lambda with code block - return literal only body', function () {
    assert.deepStrictEqual(esEval('() => { return 1234; }').exec([]), 1234);
    assert.deepStrictEqual(esEval('() => { return undefined; }').exec([]), void 0);
    assert.deepStrictEqual(esEval('() => { return NaN; }').exec([]), NaN);
    assert.deepStrictEqual(esEval('() => { return Infinity; }').exec([]), Infinity);
    assert.deepStrictEqual(esEval('() => { return false; }').exec([]), false);
    assert.deepStrictEqual(esEval('() => { return true; }').exec([]), true);
    assert.deepStrictEqual(esEval('() => { return ""; }').exec([]), '');
    assert.deepStrictEqual(esEval('() => { return "XYZ"; }').exec([]), 'XYZ');
    assert.deepStrictEqual(esEval('() => { return {}; }').exec([]), {});
    assert.deepStrictEqual(esEval('() => { return []; }').exec([]), []);
    assert.deepStrictEqual(esEval('() => { return null; }').exec([]), null);
  });

  it('lambda with code block - multiple return', function () {
    assert.deepStrictEqual(esEval('() => { return 11; return 22; return 33; }').exec([]), 11);
  });

  it('lambda with code block - no return returns undefined', function () {
    assert.deepStrictEqual(esEval('() => { 5 }').exec([]), void 0);
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
