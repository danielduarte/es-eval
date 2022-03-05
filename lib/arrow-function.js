const assert = require('assert');
const { evalExpressionNode, evalBlockStatementNode, evalBuiltInMethodImpl, NODE_BLOCK_STATEMENT, NODE_BUILTIN_METHOD_IMPL } = require('./eval');
const { Context } = require('./context');

class ArrowFunction {
  constructor(body, paramNames, isVariadic, thisTarget) {
    assert(body, 'Function body cannot be empty');
    this.body = body;
    this.paramNames = Array.isArray(paramNames) ? paramNames : [];
    this.isVariadic = !!isVariadic;
    this.thisTarget = thisTarget;
    assert(!this.isVariadic || this.paramNames.length > 0, 'Variadic functions must be at least one parameter');
  }

  exec(params, context) {
    const fnVars = this.paramNames.reduce((acc, paramName, i) => { acc[paramName] = { value: params[i], isConst: false }; return acc; }, {});

    // If it is variadic, last parameter is overridden with an array of the "rest" of the parameters (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
    if (this.isVariadic) {
      const lastParamName = this.paramNames[this.paramNames.length - 1];
      fnVars[lastParamName] = { value: params.slice(this.paramNames.length - 1), isConst: false };
    }

    const fnContext = new Context(fnVars, context);

    switch (this.body.type) {
      case NODE_BLOCK_STATEMENT:     return evalBlockStatementNode(this.body, fnContext);
      case NODE_BUILTIN_METHOD_IMPL: return evalBuiltInMethodImpl(this.body, fnContext, this.thisTarget);
      default: return evalExpressionNode(this.body, fnContext);
    }
  }

  bindThis(newTarget) {
    return new ArrowFunction(this.body, this.paramNames, this.isVariadic, newTarget);
  }
}

const builtIns = {
  Array: {
    push: new ArrowFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'push' }, ['elementN'], true),
  },
  Object: {
  }
};

const builtInsImpls = {
  Array: {
    push: (target, context) => {
      return target.push(...context.get('elementN'));
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
