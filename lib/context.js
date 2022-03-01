const assert = require('assert');

const ID_UNDEFINED = 'undefined';
const ID_INFINITY = 'Infinity';
const ID_NAN = 'NaN';

class Context {

  static EMPTY = new Context({});

  static DEFAULT = new Context({
    [ID_UNDEFINED]: void 0,
    [ID_INFINITY]: 1 / 0,
    [ID_NAN]: 0 / 0,
  });

  constructor(vars, parentContext) {
    this.parent = parentContext || null;
    this.vars = vars;
  }

  add(varName, value) {
    const ownDefined = Object.prototype.hasOwnProperty.call(this.vars, varName);
    if (ownDefined) {
      assert.fail(`Identifier already defined: '${varName}'`);
    }

    this.vars[varName] = value;
  }

  evalVar(varName) {
    const ownDefined = Object.prototype.hasOwnProperty.call(this.vars, varName);
    if (ownDefined) {
      return this.vars[varName];
    } else if (this.parent !== null)  {
      return this.parent.evalVar(varName);
    }

    assert.fail(`Identifier not defined: '${varName}'`)
  }
}

module.exports = { Context };
