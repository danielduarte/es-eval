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

const evalConditionalExpression = node => {
  assert.strictEqual(node.type, 'ConditionalExpression');

  const { test, consequent, alternate } = node;

  const op = (x, y, z) => x ? y : z;

  const testResult = evalLiteral(test, TYPE_NUMBER);
  const consequentResult = evalLiteral(consequent, TYPE_NUMBER);
  const alternateResult = evalLiteral(alternate, TYPE_NUMBER);

  return op(testResult, consequentResult, alternateResult);
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

const evalSequenceExpression = node => {
  assert.strictEqual(node.type, 'SequenceExpression');

  const { expressions } = node;
  assert.strictEqual(expressions.length >= 2, true);

  const expressionResults = expressions.map(exp => evalLiteral(exp, TYPE_NUMBER));

  return expressionResults[expressionResults.length - 1];
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
    case 'SequenceExpression': return evalSequenceExpression(expression);
    case 'ConditionalExpression': return evalConditionalExpression(expression);
    default: assert.fail(`Expected one of: 'Literal', 'UnaryExpression', 'BinaryExpression', 'LogicalExpression', 'ConditionalExpression', 'SequenceExpression'`);
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
