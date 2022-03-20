const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

const defaultOptions = { timeout: 100 }; // @todo(refactor) unify default values
const maxTimeoutDelta = 50; // 50 ms

describe('Halting', function () {

  it('stop hangup evaluation - empty statement', function () {
    let errorMsg = 'No error';
    const t0 = Date.now();
    try {
      esEval('(() => { while (true); })()');
    } catch (err) {
      errorMsg = err.message;
    }
    const t = Date.now();

    assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

    const execTime = t - t0;
    const timeout = defaultOptions.timeout;
    assert(execTime <= timeout + maxTimeoutDelta);
  });

  it('stop hangup evaluation - empty body statement', function () {
    let errorMsg = 'No error';
    const t0 = Date.now();
    try {
      esEval('(() => { while (true) {} })()');
    } catch (err) {
      errorMsg = err.message;
    }
    const t = Date.now();

    assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

    const execTime = t - t0;
    const timeout = defaultOptions.timeout;
    assert(execTime <= timeout + maxTimeoutDelta);
  });

  it('stop hangup evaluation - while statements sequence', function () {
    let errorMsg = 'No error';
    const t0 = Date.now();
    try {
      esEval(`(() => {
        while (true) {}
        while (true) {}
        while (true) {}
        while (true) {}
      })()`);
    } catch (err) {
      errorMsg = err.message;
    }
    const t = Date.now();

    assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

    const execTime = t - t0;
    const timeout = defaultOptions.timeout;
    assert(execTime <= timeout + maxTimeoutDelta);
  });

  it('stop hangup evaluation - nested while statements', function () {
    let errorMsg = 'No error';
    const t0 = Date.now();
    try {
      esEval(`(() => {
        while (true) {
          while (true) {
            while (true) {
              while (true) {
              }
            }
          }
        }
      })()`);
    } catch (err) {
      errorMsg = err.message;
    }
    const t = Date.now();

    assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

    const execTime = t - t0;
    const timeout = defaultOptions.timeout;
    assert(execTime <= timeout + maxTimeoutDelta);
  });

  it('stop hangup evaluation - while statement trying to override timeout option', function () {
    const customOpts = { ...defaultOptions, timeout: 100 };

    let errorMsg = 'No error';
    const t0 = Date.now();
    try {
      esEval(`(() => {
        options.timeout = 999999999999;
        while (true) {}
      })()`, { options: customOpts }, customOpts);

    } catch (err) {
      errorMsg = err.message;
    }
    const t = Date.now();

    assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

    const execTime = t - t0;
    const timeout = defaultOptions.timeout;
    assert(execTime <= timeout + maxTimeoutDelta);
  });

  it('stop hangup evaluation - while statements sequence with trying to override timeout option', function () {
     let errorMsg = 'No error';
     const t0 = Date.now();
     try {
       esEval(`(() => {
         let i;
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         i = 0; while (i < 200000) { i = i + 1; }
         return 1;
       })()`);

     } catch (err) {
       errorMsg = err.message;
     }
     const t = Date.now();

     assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

     const execTime = t - t0;
     const timeout = defaultOptions.timeout;
     assert(execTime <= timeout + maxTimeoutDelta);
   });

  it('stop hangup evaluation - while with infinite loop condition', function () {
    let errorMsg = 'No error';
    const t0 = Date.now();
    try {
      esEval('(() => { while ((() => { while (true); })()); })()');
    } catch (err) {
      errorMsg = err.message;
    }
    const t = Date.now();

    assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

    const execTime = t - t0;
    const timeout = defaultOptions.timeout;
    assert(execTime <= timeout + maxTimeoutDelta);
  });

  it('stop hangup evaluation - calling function does not restart the timeout', function () {
    let errorMsg = 'No error';
    const t0 = Date.now();
    try {
      esEval(`
        (() => {
          const f = () => 1;
          while (true) {
            f();
          }
        })()
      `);
    } catch (err) {
      errorMsg = err.message;
    }
    const t = Date.now();

    assert.deepStrictEqual(errorMsg, 'Evaluation timeout');

    const execTime = t - t0;
    const timeout = defaultOptions.timeout;
    assert(execTime <= timeout + maxTimeoutDelta);
  });
});
