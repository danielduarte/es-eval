'use strict';

const acorn = require('acorn');
const { evalProgram, installImplClasses, installBuiltIns } = require('./lib/eval');
const { ArrowFunction } = require('./lib/arrow-function');
const { builtIns, builtInsImpls } = require('./lib/arrow-function');
const { Context } = require('./lib/context');

installImplClasses({ ArrowFunction });
installBuiltIns(builtIns, builtInsImpls);

const evalAst = ast => {
  return evalProgram(ast, Context.DEFAULT);
};

const esEval = code => {
  code = `(${code})`;
  const ast = acorn.parse(code, { ecmaVersion: 2022 });
  return evalAst(ast);
};

module.exports = esEval;
