const { Context } = require('../context');
const { GenericFunction } = require('../../lib/function');
const { NODE_BUILTIN_METHOD_IMPL } = require('../eval');

const ID_UNDEFINED = 'undefined';
const ID_INFINITY = 'Infinity';
const ID_NAN = 'NaN';

const globalFunctions = {
  // @todo eval
  // @todo isFinite
  isNaN:      new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'globalThis', name: 'isNaN' }, [{ name: 'value' }]),
  parseFloat: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'globalThis', name: 'parseFloat' }, [{ name: 'string' }]),
  parseInt:   new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'globalThis', name: 'parseInt' }, [{ name: 'string' }, { name: 'radix', optional: true }]),
  // @todo encodeURI
  // @todo encodeURIComponent
  // @todo decodeURI
  // @todo decodeURIComponent
};

const CONTEXT_DEFAULT = new Context(Object.freeze({
  // Special identifiers
  [ID_UNDEFINED]: Object.freeze({ value: void 0, isConst: true, ignoreAssign: true }),
  [ID_INFINITY]:  Object.freeze({ value: 1 / 0,  isConst: true, ignoreAssign: true }),
  [ID_NAN]:       Object.freeze({ value: 0 / 0,  isConst: true, ignoreAssign: true }),

  // globalThis global object
  globalThis: Object.freeze({
    value: Object.freeze({
      isNaN:      globalFunctions.isNaN,
      parseFloat: globalFunctions.parseFloat,
      parseInt:   globalFunctions.parseInt,
    }),
    isConst: true, // @todo check if this value is correct
    ignoreAssign: true, // @todo check if this value is correct
  }),

  // Global functions
  // @todo check if values of isConst and ignoreAssign are correct
  isNaN: Object.freeze({ value: globalFunctions.isNaN, isConst: true, ignoreAssign: true }),
  // @todo check if values of isConst and ignoreAssign are correct
  parseFloat: Object.freeze({ value: globalFunctions.parseFloat, isConst: true, ignoreAssign: true }),
  // @todo check if values of isConst and ignoreAssign are correct
  parseInt: Object.freeze({ value: globalFunctions.parseInt, isConst: true, ignoreAssign: true }),

  // JSON global object
  JSON: Object.freeze({
    value: Object.freeze({
      parse:     new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'JSON', name: 'parse' }, [{ name: 'text' }, { name: 'reviver' }]),
      stringify: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'JSON', name: 'stringify' }, [{ name: 'value' }, { name: 'replacer' }, { name: 'space' }]),
    }),
    isConst: true,
    ignoreAssign: true,
  }),

  // Math global object
  Math: Object.freeze({ // @todo(feat) support Math functions
    value: Object.freeze({
      random: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Math', name: 'random' }),
      floor:  new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Math', name: 'floor'  }, [{ name: 'x' }]),
      ceil:   new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Math', name: 'ceil'   }, [{ name: 'x' }]),
      round:  new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Math', name: 'round'  }, [{ name: 'x' }]),
      min:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Math', name: 'min'    }, [{ name: 'valueN' }], undefined, { isVariadic: true }),
      max:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Math', name: 'max'    }, [{ name: 'valueN' }], undefined, { isVariadic: true }),
    }),
    isConst: true, // @todo check if this value is correct
    ignoreAssign: true, // @todo check if this value is correct
  }),

  // Object global constructor
  Object: Object.freeze({
    value: Object.freeze({
      entries: new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Object', name: 'entries' }, [{ name: 'obj' }]),
      keys:    new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Object', name: 'keys'    }, [{ name: 'obj' }]),
      values:  new GenericFunction({ type: NODE_BUILTIN_METHOD_IMPL, targetClass: 'Object', name: 'values'  }, [{ name: 'obj' }]),
    }),
    isConst: true, // @todo check if this value is correct
    ignoreAssign: true, // @todo check if this value is correct
  }),
}));

const CONTEXT_EMPTY = new Context(Object.freeze({}));

module.exports = {
  ID_UNDEFINED,
  ID_INFINITY,
  ID_NAN,
  CONTEXT_DEFAULT,
  CONTEXT_EMPTY,
};
