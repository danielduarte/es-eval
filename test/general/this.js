const { describe, it } = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('General', function () {
  // @todo check if should support a global object
  it('global this - set as undefined in this implementation', function () {
    assert.deepStrictEqual(esEval('this'), void 0);
  });
});
