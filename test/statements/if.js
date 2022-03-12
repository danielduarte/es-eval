const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Statements - if/else', function () {

  it('empty if/else', function () {
    assert.deepStrictEqual(esEval('(() => { if (true); })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { if (true) {} })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { if (true); else; })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { if (true); else {} })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { if (true) {} else; })()'), void 0);
    assert.deepStrictEqual(esEval('(() => { if (true) {} else {} })()'), void 0);
  });

  it('if/else - condition truthy evaluation', function () {
    const exp1 = `(() => {
      let x = [];
      if (2 > 1) { x.push('if branch'); } else { x.push('else branch'); }
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp1), ['if branch']);

    const exp2 = `(() => {
      let x = [];
      if (2 > 1) x.push('if branch'); else x.push('else branch');
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp2), ['if branch']);
  });

  it('if/else - condition falsy evaluation', function () {
    const exp1 = `(() => {
      let x = [];
      if (2 < 1) { x.push('if branch'); } else { x.push('else branch'); }
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp1), ['else branch']);

    const exp2 = `(() => {
      let x = [];
      if (2 < 1) x.push('if branch'); else x.push('else branch');
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp2), ['else branch']);
  });

  it('if/no else- condition falsy evaluation', function () {
    const exp1 = `(() => {
      let x = [];
      if (0) { x.push('if branch'); }
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp1), []);

    const exp2 = `(() => {
      let x = [];
      if (0) x.push('if branch');
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp2), []);
  });

  it('if/else - multi statement', function () {
    const exp1 = `(() => {
      let x = [];
      if (true) {
        x.push(1);
        x.push(2);
        x.push(3);
      }
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp1), [1, 2, 3]);

    const exp2 = `(() => {
      let x = [];
      if (false) {
      } else {
        x.push(1);
        x.push(2);
        x.push(3);
      }
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp2), [1, 2, 3]);
  });

  it('nested if/else', function () {
    const exp = `(() => {
      let x = [];
      if (true) {
        x.push('if 1');
        if (true) {
           x.push('if 2');
          if (false) {
            x.push('if 3');
          } else {
            x.push('else 3');
            if (true) {
              x.push('if 4');
            }
          }
        } else {
          x.push('else 2');
        }
      } else {
        x.push('else 1');
      }
      return x;
    })()`;
    assert.deepStrictEqual(esEval(exp), ['if 1', 'if 2', 'else 3', 'if 4']);
  });

  it('conditional function return (if branch)', function () {
    const exp1 = `(() => {
      let out = [];

      if (true) {
        out.push('inside if, before return');
        return out;
        out.push('inside if, after return');
      }

      out.push('after if');

      return out;
    })()`;
    assert.deepStrictEqual(esEval(exp1), ['inside if, before return']);
  });

  it('conditional function return (else branch)', function () {
    const exp1 = `(() => {
      let out = [];

      if (false) {
      } else {
        out.push('inside if, before return');
        return out;
        out.push('inside if, after return');
      }

      out.push('after if');

      return out;
    })()`;
    assert.deepStrictEqual(esEval(exp1), ['inside if, before return']);
  });

  it('nested conditional function return', function () {
    const exp1 = `(() => {
      let out = [];

      if (true) {
        out.push('inside if 1, before return');

        if (true) {
          out.push('inside if 2, before return');
          return out;
          out.push('inside if 2, after return');
        }

        out.push('inside if 1, after return');
      }

      out.push('after if');

      return out;
    })()`;
    assert.deepStrictEqual(esEval(exp1), ['inside if 1, before return', 'inside if 2, before return']);
  });
});
