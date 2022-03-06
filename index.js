'use strict';

const acorn = require('acorn');
const { evalProgram, installImplClasses, installBuiltIns } = require('./lib/eval');
const { ArrowFunction } = require('./lib/arrow-function');
const { builtIns, builtInsImpls } = require('./lib/arrow-function');
const { Context } = require('./lib/context');

installImplClasses({ ArrowFunction });
installBuiltIns(builtIns, builtInsImpls);

const evalAst = (ast, vars) => {
  let context = Context.DEFAULT;
  const userVars = Object.entries(vars);
  if (userVars.length > 0) {
    context = new Context(userVars.reduce((acc, varEntry) => { acc[varEntry[0]] = { value: varEntry[1], isConst: false }; return acc; }, {}), context);
  }
  return evalProgram(ast, context);
};

const esEval = (code, vars) => {
  code = `(${code})`;
  const ast = acorn.parse(code, { ecmaVersion: 2022 });
  return evalAst(ast, vars || {});
};

module.exports = esEval;
