const assert = require('assert');
const { evalExpressionNode, evalBlockStatementNode, evalBuiltInMethodImpl, NODE_BLOCK_STATEMENT, NODE_BUILTIN_METHOD_IMPL } = require('./eval');
const { Context } = require('./context');

class ArrowFunction {
  constructor(body, paramNames, thisTarget) {
    assert(body, 'Function body cannot be empty');
    this.body = body;
    this.paramNames = Array.isArray(paramNames) ? paramNames : [];
    this.thisTarget = thisTarget;
  }

  exec(params, context) {
    // @todo support variable qty of params. ex: array.push(1, 2, 3, ...)
    const fnVars = this.paramNames.reduce((acc, paramName, i) => { acc[paramName] = { value: params[i], isConst: false }; return acc; }, {});
    const fnContext = new Context(fnVars, context);

    switch (this.body.type) {
      case NODE_BLOCK_STATEMENT:     return evalBlockStatementNode(this.body, fnContext);
      case NODE_BUILTIN_METHOD_IMPL: return evalBuiltInMethodImpl(this.body, fnContext, this.thisTarget);
      default: return evalExpressionNode(this.body, fnContext);
    }
  }

  bindThis(newTarget) {
    return new ArrowFunction(this.body, this.paramNames, newTarget);
  }
}

const builtIns = {
  Array: {
    push: new ArrowFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'push' }, ['element']),
  },
  Object: {
  }
};

const builtInsImpls = {
  Array: {
    push: (target, context) => {
      return target.push(context.get('element'));
    },
  },
  Object: {
  }
};

module.exports = {
  ArrowFunction,
  builtIns,
  builtInsImpls,
};
