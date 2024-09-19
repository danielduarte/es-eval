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

const getMajorNodeVersion = () => {
  const version = process.version;
  return Number(version.substring(1, version.indexOf('.')));
};

module.exports = {
  assertError,
  getMajorNodeVersion,
};
