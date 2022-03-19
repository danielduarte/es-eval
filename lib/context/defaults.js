const { Context } = require('../context');
const { GenericFunction } = require('../../lib/function');

const ID_UNDEFINED = 'undefined';
const ID_INFINITY = 'Infinity';
const ID_NAN = 'NaN';

const CONTEXT_DEFAULT = new Context(Object.freeze({
  // Special identifiers
  [ID_UNDEFINED]: Object.freeze({ value: void 0, isConst: true, ignoreAssign: true }),
  [ID_INFINITY]:  Object.freeze({ value: 1 / 0,  isConst: true, ignoreAssign: true }),
  [ID_NAN]:       Object.freeze({ value: 0 / 0,  isConst: true, ignoreAssign: true }),

  // Global objects
  JSON: Object.freeze({
    value: Object.freeze({
      parse: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'JSON', name: 'parse' }, [{ name: 'text' }, { name: 'reviver' }]),
      stringify: new GenericFunction({ type: 'BuiltInMethodImpl', targetClass: 'JSON', name: 'stringify' }, [{ name: 'value' }, { name: 'replacer' }, { name: 'space' }]),
    }),
    isConst: true,
    ignoreAssign: true,
  }),
  Math: Object.freeze({ // @todo(feat) support Math functions
  }),
}));

const CONTEXT_EMPTY = new Context(Object.freeze({}));

module.exports = {
  CONTEXT_DEFAULT,
  CONTEXT_EMPTY,
};
