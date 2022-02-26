'use strict';

const assert = require('assert');
const acorn = require('acorn');

const supportedBinaryOps = {
  // Arithmetic
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y,
  '%': (x, y) => x % y,
  '**': (x, y) => x ** y,

  // Comparison and relational
  // @todo Not supported yet: 'in', 'instanceof'
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '<=': (x, y) => x <= y,
  '>=': (x, y) => x >= y,
  '==': (x, y) => x == y,
  '!=': (x, y) => x != y,
  '===': (x, y) => x === y,
  '!==': (x, y) => x !== y,

  // Bitwise shift
  '<<': (x, y) => x << y,
  '>>': (x, y) => x >> y,
  '>>>': (x, y) => x >>> y,

  // Bitwise logic
  '&': (x, y) => x & y,
  '|': (x, y) => x | y,
  '^': (x, y) => x ^ y,
};

const supportedLogicalOps = {
  // Logical
  '&&': (x, y) => x && y,
  '||': (x, y) => x || y,
  '??': (x, y) => typeof x === 'undefined' || x === null ? y : x,
};

const evalLiteral = node => {
  assert.strictEqual(node.type, 'Literal');

  const { value } = node;
  assert.strictEqual(typeof value, 'number');

  return value;
};

const evalBinaryExpression = node => {
  assert.strictEqual(node.type, 'BinaryExpression');

  const { left, right, operator } = node;
  assert(supportedBinaryOps.hasOwnProperty(operator), `Binary operator not supported '${operator}'`);
  const op = supportedBinaryOps[operator];

  const leftResult = evalLiteral(left);
  const rightResult = evalLiteral(right);

  return op(leftResult, rightResult);
};

const evalLogicalExpression = node => {
  assert.strictEqual(node.type, 'LogicalExpression');

  const { left, right, operator } = node;
  assert(supportedLogicalOps.hasOwnProperty(operator), `Logical operator not supported '${operator}'`);
  const op = supportedLogicalOps[operator];

  const leftResult = evalLiteral(left);
  const rightResult = evalLiteral(right);

  return op(leftResult, rightResult);
};

const evalExpressionStatement = node => {
  assert.strictEqual(node.type, 'ExpressionStatement');

  const { expression } = node;

  switch (expression.type) {
    case 'BinaryExpression': return evalBinaryExpression(expression);
    case 'LogicalExpression': return evalLogicalExpression(expression);
    // @todo Not supported yet: 'SequenceExpression'
    default: assert.fail(`Expected BinaryExpression or LogicalExpression`);
  }
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
