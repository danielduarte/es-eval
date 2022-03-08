const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');
const { Context } = require('../../lib/context');

describe('Arrow functions - return statement', function () {

  it('function - empty statement', function () {
    assert.deepStrictEqual(esEval('function () { ; }').exec([], Context.EMPTY), void 0);
    assert.deepStrictEqual(esEval('function () { ;;;; }').exec([], Context.EMPTY), void 0);
  });

  it('function - empty return only body', function () {
    assert.deepStrictEqual(esEval('function () { return; }').exec([], Context.EMPTY), void 0);
  });

  it('function - multiple return', function () {
    assert.deepStrictEqual(esEval('function () { return 11; return 22; return 33; }').exec([], Context.EMPTY), 11);
  });

  it('function - no return returns undefined', function () {
    assert.deepStrictEqual(esEval('function () { 5 }').exec([], Context.EMPTY), void 0);
  });

  it('function - passing a callback parameter', function () {
    const exp = `
      (() => {
        const out = [];

        const callback = function () {
          out.push('callback called!');
        };

        const main = function (param, cb) {
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
