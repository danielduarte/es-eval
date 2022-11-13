'use strict';

const acorn = require('acorn');
const { evalProgram, installImplClasses, installBuiltIns } = require('./lib/eval');
const { AbstractFunction, GenericFunction } = require('./lib/function');
const { builtIns, builtInsImpls } = require('./lib/function');
const { Context } = require('./lib/context');
const { CONTEXT_DEFAULT } = require('./lib/context/defaults');

installImplClasses({ AbstractFunction, GenericFunction });
installBuiltIns(builtIns, builtInsImpls);

const evalAst = (ast, vars, options, runState) => {
  let context = options.context || CONTEXT_DEFAULT;
  const userVars = Object.entries(vars);
  if (userVars.length > 0) {
    context = new Context(userVars.reduce((acc, varEntry) => {
      acc[varEntry[0]] = { value: varEntry[1], isConst: false };
      return acc;
    }, {}), context);
  }

  return evalProgram(ast, context, options, runState);
};

const esEval = (code, vars, options) => {
  options = Object.assign({ timeout: 100 }, options || {}); // @todo(refactor) unify default values
  // @todo(refactor) check if this freeze can be removed
  Object.freeze(options); // Even if this object is passed in the context, it cannot be altered. If it would be possible, a custom code would be able to increase the timeout for example.

  const ast = acorn.parse(`(${code})`, { ecmaVersion: 2022 });
  const runState = { startTime: Date.now() };
  return evalAst(ast, vars || {}, options, runState);
};

// Do not export other functions to call them directly. That could break the security in the execution
module.exports = esEval;
