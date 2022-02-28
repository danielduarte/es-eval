const { describe, it } = require('mocha');
const assert = require('assert');

describe('Module', function () {

  it('has expected interface', function () {
    const module = require('../..');

    const actualInterface = typeof module;

    const expectedInterface = 'function';

    assert.deepStrictEqual(actualInterface, expectedInterface);
  });

});
