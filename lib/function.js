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
    const isNative = this.body.type === NODE_BUILTIN_METHOD_IMPL;
    return isNative ? `function ${this.body.name ? this.body.name : ''}() { [native code] }` : undefined;
  }

  toJSON() { return void 0; }
}

class GenericFunction extends AbstractFunction {
  constructor(body, paramDefs, thisTarget, { isVariadic, isLambda, context } = { isVariadic: undefined, isLambda: undefined, context: null }) {
    super();
    assert(body, 'Function body cannot be empty');
    this.body = body;
    this.paramDefs = Array.isArray(paramDefs) ? paramDefs : [];
    this.thisTarget = thisTarget;
    this.isVariadic = !!isVariadic;
    this.isLambda = !!isLambda;
    this.context = context;
    assert(!this.isVariadic || this.paramDefs.length > 0, 'Variadic functions must have at least one parameter');
  }

  exec(params, context, options, runState) { // @todo deprecated parameter 'context'
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

    const fnContext = new Context(fnVars, this.context);

    // @todo support function body with a single statement without block (without { and })?
    switch (this.body.type) {
      case NODE_BLOCK_STATEMENT:     return evalBlockStatement(this.body, fnContext, this.thisTarget, options, runState).result;
      case NODE_BUILTIN_METHOD_IMPL: return evalBuiltInMethodImpl(this.body, fnContext, this.thisTarget, options, runState);
      default: return evalExpressionNode(this.body, fnContext, this.thisTarget, options, runState);
    }
  }

  bindThis(newTarget) {
    return new GenericFunction(this.body, this.paramDefs, newTarget, { isVariadic: this.isVariadic, isLambda: this.isLambda, context: this.context });
  }
}

const builtIns = {
  Array: {
    // @todo(feat) priority 1
    join:   new AbstractFunction(),
    sort:   new AbstractFunction(),
    concat: new AbstractFunction(),

    // @todo(feat) priority 2
    keys:     new AbstractFunction(),
    values:   new AbstractFunction(),
    entries:  new AbstractFunction(),
    toString: new AbstractFunction(),

    // @todo(feat) priority 3
    every:          new AbstractFunction(),
    fill:           new AbstractFunction(),
    flat:           new AbstractFunction(),
    at:             new AbstractFunction(),
    copyWithin:     new AbstractFunction(),
    flatMap:        new AbstractFunction(),
    groupBy:        new AbstractFunction(),
    groupByToMap:   new AbstractFunction(),
    reduceRight:    new AbstractFunction(),
    reverse:        new AbstractFunction(),
    some:           new AbstractFunction(),
    toLocaleString: new AbstractFunction(),
    findLast:       new AbstractFunction(),


    // Available
    map:       new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'map'       }, [{ name: 'callbackFn' }, { name: 'thisArg' }]),
    push:      new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'push'      }, [{ name: 'elementN' }], undefined, { isVariadic: true }),
    reduce:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'reduce'    }, [{ name: 'callbackFn' }, { name: 'initialValue', optional: true }]),
    includes:  new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'includes'  }, [{ name: 'searchElement' }, { name: 'fromIndex' }]),
    filter:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'filter'    }, [{ name: 'callbackFn' }, { name: 'thisArg' }]),
    pop:       new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'pop'       }),
    shift:     new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'shift'     }),
    unshift:   new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'unshift'   }, [{ name: 'elementN' }], undefined, { isVariadic: true }),
    slice:     new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'slice'     }, [{ name: 'start' }, { name: 'end' }]),
    splice:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'splice'    }, [{ name: 'start', optional: true }, { name: 'deleteCount', optional: true }, { name: 'itemN' }], undefined, { isVariadic: true }),
    forEach:   new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'forEach'   }, [{ name: 'callbackFn' }, { name: 'thisArg' }]),
    find:      new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'find'      }, [{ name: 'callbackFn' }, { name: 'thisArg' }]),
    findIndex: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'findIndex' }, [{ name: 'callbackFn' }, { name: 'thisArg' }]),
    indexOf:     new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'indexOf'     }, [{ name: 'searchElement' }, { name: 'fromIndex' }]),
    lastIndexOf: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Array', name: 'lastIndexOf' }, [{ name: 'searchElement' }, { name: 'fromIndex', optional: true }]),
  },

  Object: {
    hasOwnProperty:       new AbstractFunction(),
    isPrototypeOf:        new AbstractFunction(),
    propertyIsEnumerable: new AbstractFunction(),
    toLocaleString:       new AbstractFunction(),
    toSource:             new AbstractFunction(),
    toString:             new AbstractFunction(),
    valueOf:              new AbstractFunction(),
  },

  String: {
    toLowerCase: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'toLowerCase' }),
    toUpperCase: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'toUpperCase' }),

    trim:        new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'trim' }),
    trimStart:   new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'trimStart' }),
    trimLeft:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'trimLeft' }),
    trimEnd:     new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'trimEnd' }),
    trimRight:   new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'trimRight' }),

    toString:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'toString' }),
    valueOf:     new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'String', name: 'valueOf' }),

    at:                new AbstractFunction(),
    charAt:            new AbstractFunction(),
    charCodeAt:        new AbstractFunction(),
    fromCharCode:      new AbstractFunction(),
    codePointAt:       new AbstractFunction(),
    fromCodePoint:     new AbstractFunction(),

    concat:            new AbstractFunction(),
    endsWith:          new AbstractFunction(),
    includes:          new AbstractFunction(),
    indexOf:           new AbstractFunction(),
    lastIndexOf:       new AbstractFunction(),
    localeCompare:     new AbstractFunction(),
    match:             new AbstractFunction(),
    matchAll:          new AbstractFunction(),
    normalize:         new AbstractFunction(),
    padEnd:            new AbstractFunction(),
    padStart:          new AbstractFunction(),
    repeat:            new AbstractFunction(),
    replace:           new AbstractFunction(),
    replaceAll:        new AbstractFunction(),
    search:            new AbstractFunction(),
    slice:             new AbstractFunction(),
    split:             new AbstractFunction(),
    startsWith:        new AbstractFunction(),
    substring:         new AbstractFunction(),
    toLocaleLowerCase: new AbstractFunction(),
    toLocaleUpperCase: new AbstractFunction(),
  },
};

// @todo implement static methods for Array
// Array.from()
// Array.isArray()
// Array.of()

// @todo implement static methods for Object
// Object.assign()
// Object.create()
// Object.fromEntries()
// Object.defineProperties()
// Object.defineProperty()
// Object.freeze()
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
    isArray: (target, context, options, runState) => {
      const value = context.get('value');
      return Array.isArray(value);
    },
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
      const callbackFn = context.get('callbackFn');
      const isFunc = callbackFn instanceof AbstractFunction;
      assert(isFunc, 'Function expected');

      const fn = (elem, i, array) => callbackFn.bindThis(thisArg).exec([elem, i, array], context, options, runState);
      return target.filter(fn);
    },
    pop: (target, context, options, runState) => {
      return target.pop();
    },
    shift: (target, context, options, runState) => {
      return target.shift();
    },
    unshift: (target, context, options, runState) => {
      return target.unshift(...context.get('elementN'));
    },
    slice: (target, context, options, runState) => {
      const start = context.get('start');
      const end = context.get('end');

      return target.slice(start, end);
    },
    splice: (target, context, options, runState) => {
      const params = [];
      if (context.isDefined('start')) { params.push(context.get('start')); }
      if (context.isDefined('deleteCount')) { params.push(context.get('deleteCount')); }

      const itemN = context.get('itemN');
      return target.splice(...params, ...itemN);
    },
    forEach: (target, context, options, runState) => {
      const thisArg = context.get('thisArg');
      const callbackFn = context.get('callbackFn');
      const isFunc = callbackFn instanceof AbstractFunction;
      assert(isFunc, 'Function expected');

      const fn = (elem, i, array) => callbackFn.bindThis(thisArg).exec([elem, i, array], context, options, runState);
      return target.forEach(fn);
    },
    find: (target, context, options, runState) => {
      const callbackFn = context.get('callbackFn');
      const isFunc = callbackFn instanceof AbstractFunction;
      assert(isFunc, 'undefined is not a function');

      const thisArg = context.get('thisArg');
      const fn = (element, index, array) => callbackFn.bindThis(thisArg).exec([element, index, array], context, options, runState);
      return target.find(fn);
    },
    findIndex: (target, context, options, runState) => {
      const callbackFn = context.get('callbackFn');
      const isFunc = callbackFn instanceof AbstractFunction;
      assert(isFunc, 'undefined is not a function');

      const thisArg = context.get('thisArg');
      const fn = (element, index, array) => callbackFn.bindThis(thisArg).exec([element, index, array], context, options, runState);
      return target.findIndex(fn);
    },
    indexOf: (target, context, options, runState) => {
      const elem = context.get('searchElement');
      const from = context.get('fromIndex');
      return target.indexOf(elem, from);
    },
    lastIndexOf: (target, context, options, runState) => {
      const elem = context.get('searchElement');
      if (context.isDefined('fromIndex')) {
        const from = context.get('fromIndex');
        return target.lastIndexOf(elem, from);
      } else {
        return target.lastIndexOf(elem);
      }
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
  String: {
    toLowerCase: (target, context, options, runState) => {
      return target.toLowerCase();
    },
    toUpperCase: (target, context, options, runState) => {
      return target.toUpperCase();
    },
    trim: (target, context, options, runState) => {
      return target.trim();
    },
    trimStart: (target, context, options, runState) => {
      return target.trimStart();
    },
    trimLeft: (target, context, options, runState) => {
      return target.trimLeft();
    },
    trimEnd: (target, context, options, runState) => {
      return target.trimEnd();
    },
    trimRight: (target, context, options, runState) => {
      return target.trimRight();
    },
    toString: (target, context, options, runState) => {
      return target.toString();
    },
    valueOf: (target, context, options, runState) => {
      return target.valueOf();
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
  },
  Math: {
    random: (target, context, options, runState) => {
      return Math.random();
    },
    floor: (target, context, options, runState) => {
      const x = context.get('x');
      if (x instanceof AbstractFunction) { return NaN; }
      return Math.floor(x);
    },
    ceil: (target, context, options, runState) => {
      const x = context.get('x');
      if (x instanceof AbstractFunction) { return NaN; }
      return Math.ceil(x);
    },
    round: (target, context, options, runState) => {
      const x = context.get('x');
      if (x instanceof AbstractFunction) { return NaN; }
      return Math.round(x);
    },
    min: (target, context, options, runState) => {
      const values = context.get('valueN').map(value => value instanceof AbstractFunction ? NaN : value);
      return Math.min(...values);
    },
    max: (target, context, options, runState) => {
      const values = context.get('valueN').map(value => value instanceof AbstractFunction ? NaN : value);
      return Math.max(...values);
    },
  },
  globalThis: {
    isNaN: (target, context, options, runState) => {
      const value = context.get('value');
      return isNaN(value);
    },
    isFinite: (target, context, options, runState) => {
      const value = context.get('testValue');
      return isFinite(value);
    },
    parseFloat: (target, context, options, runState) => {
      const string = context.get('string');
      // @todo Check if `string` has the method `toString`, and in that case run it before passing it to `parseFloat`. This would support cases like parseFloat({ toString: () => '1.2' })
      return parseFloat(string);
    },
    parseInt: (target, context, options, runState) => {
      const string = context.get('string');
      // @todo Check if `string` has the method `toString`, and in that case run it before passing it to `parseInt`. This would support cases like parseInt({ toString: () => '1.2' })
      if (context.isDefined('radix')) {
        const radix = context.get('radix');
        return parseInt(string, radix);
      } else {
        return parseInt(string);
      }
    },
  },
};

module.exports = {
  AbstractFunction,
  GenericFunction,
  builtIns,
  builtInsImpls,
};
