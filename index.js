'use strict';

const acorn = require('acorn');
const { evalProgram, installImplClasses } = require('./lib/eval');
const { ArrowFunction } = require('./lib/arrow-function');
const { Context } = require('./lib/context');

installImplClasses({ ArrowFunction });

const evalAst = ast => {
  return evalProgram(ast, Context.DEFAULT);
};

const esEval = code => {
  const ast = acorn.parse(code, { ecmaVersion: 2022 });
  return evalAst(ast);
};

module.exports = esEval;
