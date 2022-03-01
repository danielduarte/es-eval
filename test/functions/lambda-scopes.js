const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Function scopes', function () {
  it('lambda - see outside scope variable', function () {

    // Inner function knows both 'a' (from outside context) and 'b' (from own context since it is a parameter)
    const exp = `
      (a =>
        (b => b + a)(222)
      )(111)
    `;

    assert.deepStrictEqual(esEval(exp), 333);
  });

  it('lambda - do not see inside scope variable', function () {

    // Inner function knows both 'a' (from outside context) and 'b' (from own context since it is a parameter)
    const exp = `
      (a =>
        (b => b)(2222) + b
      )(1111)
    `;

    let errMessage = 'NO ERROR';
    try {
      esEval(exp);
    } catch (err) {
      errMessage = err.message;
    }

    assert.deepStrictEqual(errMessage, `Identifier not defined: 'b'`);
  });
});
