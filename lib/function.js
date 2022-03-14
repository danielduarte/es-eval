const assert = require('assert');
const { evalExpressionNode, evalBlockStatement, evalBuiltInMethodImpl, NODE_BLOCK_STATEMENT, NODE_BUILTIN_METHOD_IMPL } = require('./eval');
const { Context } = require('./context');

class AbstractFunction {
  exec() {
    const target = this.targetClass ? `${this.targetClass}.prototype` : 'target';
    throw new Error('Not implemented yet' + (this.name ? `: ${target}.${this.name}(...)` : ''));
  }

  bindThis(newTarget) {
    return new AbstractFunction();
  }
}

class GenericFunction extends AbstractFunction { // @todo generalize class name to all functions, not only lambdas
  constructor(body, paramDefs, isVariadic, isLambda, thisTarget) {
    super();
    assert(body, 'Function body cannot be empty');
    this.body = body;
    this.paramDefs = Array.isArray(paramDefs) ? paramDefs : [];
    this.isVariadic = !!isVariadic;
    this.isLambda = !!isLambda;
    this.thisTarget = thisTarget;
    assert(!this.isVariadic || this.paramDefs.length > 0, 'Variadic functions must be at least one parameter');
  }

  exec(params, context, options, runState) {
    // If runState is defined, preserve the same object. Otherwise create a new one (when user is using .exec() directly)
    runState = Object.assign(runState || {}, { startTime: Date.now() });

    options = Object.assign({ timeout: 300 }, options || {}); // @todo unify default values
    // @todo check if this freeze can be removed
    Object.freeze(options); // Even if this object is passed in the context, it cannot be altered. If it would be possible, a custom code would be able to increase the timeout for example.

    const fnVars = this.paramDefs.reduce((acc, { name, optional }, i) => {
      const paramWasProvided = i <= params.length - 1;
      const autoInitParam = !optional;
      if (paramWasProvided || autoInitParam) {
        acc[name] = { value: params[i], isConst: false };
      } else {
        assert(`Not provided parameter ${name} calling ${this.body.name}(...)`);
      }

      return acc;
    }, {});

    // If it is variadic, last parameter is overridden with an array of the "rest" of the parameters (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
    if (this.isVariadic) {
      const lastParamName = this.paramDefs[this.paramDefs.length - 1].name;
      fnVars[lastParamName] = { value: params.slice(this.paramDefs.length - 1), isConst: false };
    }

    const fnContext = new Context(fnVars, context);

    // @todo support function body with a single statement without block (without { and })?
    switch (this.body.type) {
      case NODE_BLOCK_STATEMENT:     return evalBlockStatement(this.body, fnContext, this.thisTarget, options, runState).result;
      case NODE_BUILTIN_METHOD_IMPL: return evalBuiltInMethodImpl(this.body, fnContext, this.thisTarget, options, runState);
      default: return evalExpressionNode(this.body, fnContext, this.thisTarget, options, runState);
    }
  }

  bindThis(newTarget) {
    return new GenericFunction(this.body, this.paramDefs, this.isVariadic, this.isLambda, newTarget);
  }
}

const builtIns = {
  Array: {
    keys: new AbstractFunction(),
    pop: new AbstractFunction(),
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
    map: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'map' }, [{ name: 'callbackFn' }, { name: 'thisArg' }]),
    push: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'push' }, [{ name: 'elementN' }], true),
    reduce: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'reduce' }, [{ name: 'callbackFn' }, { name: 'initialValue', optional: true }]),
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

// @todo implement static methods for Array
// Array.from()
// Array.isArray()
// Array.of()

// @todo implement static methods for Object
// Object.assign()
// Object.create()
// Object.defineProperties()
// Object.defineProperty()
// Object.entries()
// Object.freeze()
// Object.fromEntries()
// Object.getOwnPropertyDescriptor()
// Object.getOwnPropertyDescriptors()
// Object.getOwnPropertyNames()
// Object.getOwnPropertySymbols()
// Object.getPrototypeOf()
// Object.hasOwn()
// Object.is()
// Object.isExtensible()
// Object.isFrozen()
// Object.isSealed()
// Object.keys()
// Object.preventExtensions()
// Object.seal()
// Object.setPrototypeOf()
// Object.values()

const builtInsImpls = {
  Array: {
    push: (target, context, options, runState) => {
      return target.push(...context.get('elementN'));
    },
    map: (target, context, options, runState) => {
      // @todo support thisArg
      const fn = context.get('callbackFn');
      return target.map((elem, i) => fn.exec([elem, i, target], context, options, runState));
    },
    reduce: (target, context, options, runState) => {
      const fn = context.get('callbackFn');
      if (context.isDefined('initialValue')) {
        const initial = context.get('initialValue');
        return target.reduce((acc, elem, i) => fn.exec([acc, elem, i, target], context, options, runState), initial);
      } else {
        return target.reduce((acc, elem, i) => fn.exec([acc, elem, i, target], context, options, runState));
      }
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
