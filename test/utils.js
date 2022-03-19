const assert = require('assert');

const assertError = (func, message) => {
  let errorMsg = 'No error';
  try {
    func();
  } catch (err) {
    errorMsg = err.message;
  }
  assert.deepStrictEqual(errorMsg, message);
};

module.exports = {
  assertError,
};
