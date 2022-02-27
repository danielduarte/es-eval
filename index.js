'use strict';

const assert = require('assert');
const acorn = require('acorn');

const TYPE_NUMBER = 'number';

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

const supportedUnaryOps = {
  // Arithmetic
  '+': x => +x,
  '-': x => -x,

  // Bitwise logic
  '~': x => ~x,

  // Logical
  '!': x => !x,

  // General
  'typeof': x => typeof x,
  'void': x => void x,
  'delete': () => true,
};

const evalLiteral = (node, typeName) => {
  assert.strictEqual(node.type, 'Literal');

  const { value } = node;
  assert(typeof value === typeName, `Expected '${typeName}' argument`);

  return value;
};

const evalBinaryExpression = node => {
  assert.strictEqual(node.type, 'BinaryExpression');

  const { left, right, operator } = node;
  assert(supportedBinaryOps.hasOwnProperty(operator), `Binary operator not supported '${operator}'`);
  const op = supportedBinaryOps[operator];

  const leftResult = evalLiteral(left, TYPE_NUMBER);
  const rightResult = evalLiteral(right, TYPE_NUMBER);

  return op(leftResult, rightResult);
};

const evalLogicalExpression = node => {
  assert.strictEqual(node.type, 'LogicalExpression');

  const { left, right, operator } = node;
  assert(supportedLogicalOps.hasOwnProperty(operator), `Logical operator not supported '${operator}'`);
  const op = supportedLogicalOps[operator];

  const leftResult = evalLiteral(left, TYPE_NUMBER);
  const rightResult = evalLiteral(right, TYPE_NUMBER);

  return op(leftResult, rightResult);
};

const evalUnaryExpression = node => {
  assert.strictEqual(node.type, 'UnaryExpression');

  const { argument, prefix, operator } = node;
  assert(prefix);
  assert(supportedUnaryOps.hasOwnProperty(operator), `Unary operator not supported '${operator}'`);
  const op = supportedUnaryOps[operator];

  const argumentResult = evalLiteral(argument, TYPE_NUMBER);

  return op(argumentResult);
};

const evalExpressionStatement = node => {
  assert.strictEqual(node.type, 'ExpressionStatement');

  const { expression } = node;

  switch (expression.type) {
    case 'Literal': return evalLiteral(expression, TYPE_NUMBER);
    case 'UnaryExpression': return evalUnaryExpression(expression);
    case 'BinaryExpression': return evalBinaryExpression(expression);
    case 'LogicalExpression': return evalLogicalExpression(expression);
    // @todo Not supported yet: 'SequenceExpression'
    default: assert.fail(`Expected one of: 'UnaryExpression', 'BinaryExpression', 'LogicalExpression'`);
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
