const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Short-circuit', function () {

  it('logic OR short circuit (||)', function () {
    const exp = `
      (() => {
        const run = [];
        const trueFn = () => { run.push("trueFn was executed"); return true; };
        const result = true || trueFn();
        return { result: result, run: run };
      })()
    `;
    assert.deepStrictEqual(esEval(exp), { result: true, run: [] });
  });

  it('logic AND short circuit (&&)', function () {
    const exp = `
      (() => {
        const run = [];
        const trueFn = () => { run.push("trueFn was executed"); return true; };
        const result = false && trueFn();
        return { result: result, run: run };
      })()
    `;
    assert.deepStrictEqual(esEval(exp), { result: false, run: [] });
  });

  it('nullish coalescing short circuit (??)', function () {
    const exp = `
      (() => {
        const run = [];
        const trueFn = () => { run.push("trueFn was executed"); return true; };
        const result = 1 ?? trueFn();
        return { result: result, run: run };
      })()
    `;
    assert.deepStrictEqual(esEval(exp), { result: 1, run: [] });
  });

  it('conditional short circuit (??)', function () {
    const exp1 = `
      (() => {
        const run = [];
        const f1 = () => { run.push("f1 was executed"); return 'f1'; };
        const f2 = () => { run.push("f2 was executed"); return 'f2'; };
        const result = true ? f1() : f2();
        return { result: result, run: run };
      })()
    `;
    assert.deepStrictEqual(esEval(exp1), { result: 'f1', run: ['f1 was executed'] });

    const exp2 = `
      (() => {
        const run = [];
        const f1 = () => { run.push("f1 was executed"); return 'f1'; };
        const f2 = () => { run.push("f2 was executed"); return 'f2'; };
        const result = false ? f1() : f2();
        return { result: result, run: run };
      })()
    `;
    assert.deepStrictEqual(esEval(exp2), { result: 'f2', run: ['f2 was executed'] });
  });

});
