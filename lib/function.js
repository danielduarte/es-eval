const assert = require('assert');
const { evalExpressionNode, evalBlockStatement, evalBuiltInMethodImpl, NODE_BLOCK_STATEMENT, NODE_BUILTIN_METHOD_IMPL } = require('./eval');
const { Context } = require('./context');

class AbstractFunction {
  exec() {
    throw new Error('Not implemented yet');
  }

  bindThis(newTarget) {
    return new AbstractFunction();
  }
}

class GenericFunction extends AbstractFunction { // @todo generalize class name to all functions, not only lambdas
  constructor(body, paramNames, isVariadic, isLambda, thisTarget) {
    super();
    assert(body, 'Function body cannot be empty');
    this.body = body;
    this.paramNames = Array.isArray(paramNames) ? paramNames : [];
    this.isVariadic = !!isVariadic;
    this.isLambda = !!isLambda;
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
      case NODE_BLOCK_STATEMENT:     return evalBlockStatement(this.body, fnContext, this.thisTarget);
      case NODE_BUILTIN_METHOD_IMPL: return evalBuiltInMethodImpl(this.body, fnContext, this.thisTarget);
      default: return evalExpressionNode(this.body, fnContext, this.thisTarget);
    }
  }

  bindThis(newTarget) {
    return new GenericFunction(this.body, this.paramNames, this.isVariadic, this.isLambda, newTarget);
  }
}

const builtIns = {
  Array: {
    keys: new AbstractFunction(),
    pop: new AbstractFunction(),
    reduce: new AbstractFunction(),
    shift: new AbstractFunction(),
    slice: new AbstractFunction(),
    sort: new AbstractFunction(),
    splice: new AbstractFunction(),
    values: new AbstractFunction(),
    unshift: new AbstractFunction(),
    entries: new AbstractFunction(),
    concat: new AbstractFunction(),
    filter: new AbstractFunction(),
    find: new AbstractFunction(),
    findIndex: new AbstractFunction(),
    forEach: new AbstractFunction(),
    indexOf: new AbstractFunction(),
    every: new AbstractFunction(),
    fill: new AbstractFunction(),
    flat: new AbstractFunction(),
    at: new AbstractFunction(),
    copyWithin: new AbstractFunction(),
    flatMap: new AbstractFunction(),
    groupBy: new AbstractFunction(),
    groupByToMap: new AbstractFunction(),
    includes: new AbstractFunction(),
    join: new AbstractFunction(),
    lastIndexOf: new AbstractFunction(),
    reduceRight: new AbstractFunction(),
    reverse: new AbstractFunction(),
    some: new AbstractFunction(),
    toLocaleString: new AbstractFunction(),
    toString: new AbstractFunction(),

    // Available
    map: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'map' }, ['callbackFn', 'thisArg']),
    push: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'push' }, ['elementN'], true),
  },
  Object: {
    hasOwnProperty: new AbstractFunction(),
    isPrototypeOf: new AbstractFunction(),
    propertyIsEnumerable: new AbstractFunction(),
    toLocaleString: new AbstractFunction(),
    toSource: new AbstractFunction(),
    toString: new AbstractFunction(),
    valueOf: new AbstractFunction(),
  }
};

const builtInsImpls = {
  Array: {
    push: (target, context) => {
      return target.push(...context.get('elementN'));
    },
    map: (target, context) => {
      // @todo support thisArg
      const fn = context.get('callbackFn');
      return target.map((elem, i) => fn.exec([elem, i, target], context));
    },
  },
  Object: {
  }
};

module.exports = {
  AbstractFunction,
  GenericFunction,
  builtIns,
  builtInsImpls,
};
