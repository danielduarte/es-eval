const assert = require('assert');
const { evalExpressionNode, evalBlockStatement, evalBuiltInMethodImpl, NODE_BLOCK_STATEMENT, NODE_BUILTIN_METHOD_IMPL } = require('./eval');
const { Context } = require('./context');

class AbstractFunction {
  exec() {
    const target = this.targetClass ? `${this.targetClass}.prototype` : 'target';
    throw new Error('Not implemented yet' + (this.name ? `: ${target}.${this.name}()` : ''));
  }

  bindThis(newTarget) {
    return new AbstractFunction();
  }

  toString() {
    // @todo(feat) support toString() for non-native functions
    const isNative = this.body.type === 'BuiltInMethodImpl';
    return isNative ? `function ${this.body.name ? this.body.name : ''}() { [native code] }` : undefined;
  }

  toJSON() { return void 0; }
}

class GenericFunction extends AbstractFunction {
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
    runState = runState || { startTime: Date.now() };

    options = Object.assign({ timeout: 100 }, options || {}); // @todo(refactor) unify default values
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
    includes: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'includes' }, [{ name: 'searchElement' }, { name: 'fromIndex' }]),
    filter: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Array', name: 'filter' }, [{ name: 'callbackFn' }, { name: 'thisArg' }]),
  },

  Object: {
    hasOwnProperty: new AbstractFunction(),
    isPrototypeOf: new AbstractFunction(),
    propertyIsEnumerable: new AbstractFunction(),
    toLocaleString: new AbstractFunction(),
    toSource: new AbstractFunction(),
    toString: new AbstractFunction(),
    valueOf: new AbstractFunction(),
  },
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
// Object.preventExtensions()
// Object.seal()
// Object.setPrototypeOf()

const builtInsImpls = {
  Array: {
    push: (target, context, options, runState) => {
      return target.push(...context.get('elementN'));
    },
    map: (target, context, options, runState) => {
      // @todo support thisArg
      const fn = context.get('callbackFn');
      // @todo check if fn is not nullish
      return target.map((elem, i, array) => fn.exec([elem, i, array], context, options, runState));
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
    includes: (target, context, options, runState) => {
      const elem = context.get('searchElement');
      const from = context.get('fromIndex');
      return target.includes(elem, from);
    },
    filter: (target, context, options, runState) => {
      const thisArg = context.get('thisArg');
      const callbackFn = context.get('callbackFn').bindThis(thisArg);

      const fn = (elem, i, array) => callbackFn.exec([elem, i, array], context, options, runState);
      return target.filter(fn);
    },
  },
  Object: {
    entries: (target, context, options, runState) => {
      const obj = context.get('obj');
      if (obj instanceof AbstractFunction) { return []; }
      return Object.entries(obj);
    },
    keys: (target, context, options, runState) => {
      const obj = context.get('obj');
      if (obj instanceof AbstractFunction) { return []; }
      return Object.keys(obj);
    },
    values: (target, context, options, runState) => {
      const obj = context.get('obj');
      if (obj instanceof AbstractFunction) { return []; }
      return Object.values(obj);
    },
  },
  JSON: {
    parse: (target, context, options, runState) => {
      const text = context.get('text');
      const reviver = context.get('reviver');
      const fn = reviver && ((key, value) => reviver.exec([key, value], context, options, runState));
      return JSON.parse(text, fn);
    },
    stringify: (target, context, options, runState) => {
      const value = context.get('value');
      const replacer = context.get('replacer');
      const space = context.get('space');

      const isFunc = replacer instanceof AbstractFunction; // @todo create helper for this check
      let replacerParam = replacer; // Replacer could be an array
      if (isFunc) {
        replacerParam = (key, value) => replacer.exec([key, value], context, options, runState);
      }

      let valueParam = value;
      const hasCustomToJSON = Object.prototype.hasOwnProperty.call(value, 'toJSON') && value.toJSON instanceof AbstractFunction;
      if (hasCustomToJSON) {
        const customToJSON = () => value.toJSON.exec([], context, options, runState); // @todo check 'this' behavior in this function
        valueParam = { ...value, toJSON: customToJSON };
      }

      return JSON.stringify(valueParam, replacerParam, space);
    },
  }
};

module.exports = {
  AbstractFunction,
  GenericFunction,
  builtIns,
  builtInsImpls,
};
