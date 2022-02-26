'use strict';

const assert = require('assert');
const acorn = require('acorn');

const evalLiteral = node => {
  assert.strictEqual(node.type, 'Literal');

  const { value } = node;
  assert.strictEqual(typeof value, 'number');

  return value;
};

const evalBinaryExpression = node => {
  assert.strictEqual(node.type, 'BinaryExpression');

  const supportedBinaryOperators = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    '%': (x, y) => x % y,
  };


  const { left, right, operator } = node;
  assert(supportedBinaryOperators.hasOwnProperty(operator), `Operator not supported '${operator}'`);
  const op = supportedBinaryOperators[operator];

  const leftResult = evalLiteral(left);
  const rightResult = evalLiteral(right);

  return op(leftResult, rightResult);
};

const evalExpressionStatement = node => {
  assert.strictEqual(node.type, 'ExpressionStatement');

  const { expression } = node;

  return evalBinaryExpression(expression);
};

const evalProgram = node => {
  assert.strictEqual(node.type, 'Program');

  const { body } = node;
  assert.strictEqual(body.length, 1);

  const statement = body[0];

  return evalExpressionStatement(statement);
};

const evalAst = ast => {
  return evalProgram(ast);
};

const esEval = code => {
  const ast = acorn.parse(code, { ecmaVersion: 2022 });
  return evalAst(ast);
};

module.exports = esEval;
