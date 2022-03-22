const { Context } = require('../context');
const { AbstractFunction, GenericFunction } = require('../../lib/function');

const ID_UNDEFINED = 'undefined';
const ID_INFINITY = 'Infinity';
const ID_NAN = 'NaN';

const CONTEXT_DEFAULT = new Context(Object.freeze({
  // Special identifiers
  [ID_UNDEFINED]: Object.freeze({ value: void 0, isConst: true, ignoreAssign: true }),
  [ID_INFINITY]:  Object.freeze({ value: 1 / 0,  isConst: true, ignoreAssign: true }),
  [ID_NAN]:       Object.freeze({ value: 0 / 0,  isConst: true, ignoreAssign: true }),

  // JSON global object
  JSON: Object.freeze({
    value: Object.freeze({
      parse:     new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'JSON', name: 'parse' }, [{ name: 'text' }, { name: 'reviver' }]),
      stringify: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'JSON', name: 'stringify' }, [{ name: 'value' }, { name: 'replacer' }, { name: 'space' }]),
    }),
    isConst: true,
    ignoreAssign: true,
  }),

  // Math global object
  Math: Object.freeze({ // @todo(feat) support Math functions
    value: Object.freeze({
    }),
    isConst: true, // @todo check if this value is correct
    ignoreAssign: true, // @todo check if this value is correct
  }),

  // Object global constructor
  Object: Object.freeze({
    value: Object.freeze({
      entries: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Object', name: 'entries' }, [{ name: 'obj' }]),
      keys:    new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Object', name: 'keys' }, [{ name: 'obj' }]),
      values:  new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'Object', name: 'values' }, [{ name: 'obj' }]),
    }),
    isConst: true, // @todo check if this value is correct
    ignoreAssign: true, // @todo check if this value is correct
  }),
}));

const CONTEXT_EMPTY = new Context(Object.freeze({}));

module.exports = {
  CONTEXT_DEFAULT,
  CONTEXT_EMPTY,
};
