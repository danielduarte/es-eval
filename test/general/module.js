const { describe, it } = require('mocha');
const assert = require('assert');

describe('Module', function () {

  it('has expected interface', function () {
    const module = require('../..');

    const actualInterface = [typeof module, module.length];
    const expectedInterface = ['function', 3]; // The module is a function with 3 parameters

    assert.deepStrictEqual(actualInterface, expectedInterface);
  });

});
