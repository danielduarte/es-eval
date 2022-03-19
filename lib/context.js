const assert = require('assert');

class Context {

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
      // @todo(test) test this case where a var is set in parent scope
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

  isDefined(varName) {
    const ownDefined = Object.prototype.hasOwnProperty.call(this.vars, varName);
    if (ownDefined) {
      return true;
    } else if (this.parent !== null)  {
      return this.parent.isDefined(varName);
    }

    return false;
  }
}

module.exports = { Context };
