const assert = require('assert');

const ID_UNDEFINED = 'undefined';
const ID_INFINITY = 'Infinity';
const ID_NAN = 'NaN';

class Context {

  static EMPTY = new Context(Object.freeze({}));

  static DEFAULT = new Context(Object.freeze({
    [ID_UNDEFINED]: Object.freeze({ value: void 0, isConst: true, ignoreAssign: true }),
    [ID_INFINITY]:  Object.freeze({ value: 1 / 0,  isConst: true, ignoreAssign: true }),
    [ID_NAN]:       Object.freeze({ value: 0 / 0,  isConst: true, ignoreAssign: true }),
  }));

  constructor(vars, parentContext) {
    this.parent = parentContext || null;
    this.vars = vars;
  }

  add(varName, value, isConst) {
    const ownDefined = Object.prototype.hasOwnProperty.call(this.vars, varName);
    if (ownDefined) {
      assert.fail(`Identifier already defined: '${varName}'`);
    }

    this.vars[varName] = { value, isConst };
  }

  set(varName, value) {
    const ownDefined = Object.prototype.hasOwnProperty.call(this.vars, varName);
    if (ownDefined) {
      const existingVar = this.vars[varName];
      if (existingVar.ignoreAssign) {
        return value;
      }
      if (existingVar.isConst) {
        assert.fail(`Cannot re-assign a constant: '${varName}'`);
      }
      return this.vars[varName].value = value;
    } else if (this.parent !== null)  {
      // @todo test this case where a var is set in parent scope
      return this.parent.set(varName, value);
    }

    assert.fail(`Identifier not defined: '${varName}'`);
  }

  get(varName) {
    const ownDefined = Object.prototype.hasOwnProperty.call(this.vars, varName);
    if (ownDefined) {
      return this.vars[varName].value;
    } else if (this.parent !== null)  {
      return this.parent.get(varName);
    }

    assert.fail(`Identifier not defined: '${varName}'`);
  }
}

module.exports = { Context };