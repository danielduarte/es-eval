'use strict';

const assert = require('assert');
const acorn = require('acorn');

const TYPE_NUMBER = 'number';
const TYPE_BOOLEAN = 'boolean';

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
  'delete': x => typeof x === 'number' || typeof x === 'boolean',
};

const evalLiteral = (node, typeNames) => {
  assert.strictEqual(node.type, 'Literal');

  const { value } = node;
  assert(typeNames.includes(typeof value), `Expected one of ${typeNames.map(t => `'${t}'`).join(', ')} as argument`);

  return value;
};

const evalIdentifier = (node) => {
  assert.strictEqual(node.type, 'Identifier');

  const { name } = node;
  assert.strictEqual(name, 'undefined');
  // @todo make sure 'undefined' is not being used as identifier
  const value = void 0;

  return value;
};

const evalConditionalExpression = node => {
  assert.strictEqual(node.type, 'ConditionalExpression');

  const { test, consequent, alternate } = node;

  const op = (x, y, z) => x ? y : z;

  const testResult = evalExpressionNode(test, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const consequentResult = evalExpressionNode(consequent, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const alternateResult = evalExpressionNode(alternate, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(testResult, consequentResult, alternateResult);
};

const evalBinaryExpression = node => {
  assert.strictEqual(node.type, 'BinaryExpression');

  const { left, right, operator } = node;
  assert(supportedBinaryOps.hasOwnProperty(operator), `Binary operator not supported '${operator}'`);
  const op = supportedBinaryOps[operator];

  const leftResult = evalExpressionNode(left, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const rightResult = evalExpressionNode(right, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(leftResult, rightResult);
};

const evalLogicalExpression = node => {
  assert.strictEqual(node.type, 'LogicalExpression');

  const { left, right, operator } = node;
  assert(supportedLogicalOps.hasOwnProperty(operator), `Logical operator not supported '${operator}'`);
  const op = supportedLogicalOps[operator];

  const leftResult = evalExpressionNode(left, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const rightResult = evalExpressionNode(right, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(leftResult, rightResult);
};

const evalSequenceExpression = node => {
  assert.strictEqual(node.type, 'SequenceExpression');

  const { expressions } = node;
  assert.strictEqual(expressions.length >= 2, true);

  const expressionResults = expressions.map(exp => evalExpressionNode(exp, [TYPE_NUMBER, TYPE_BOOLEAN]));

  return expressionResults[expressionResults.length - 1];
};

const evalUnaryExpression = node => {
  assert.strictEqual(node.type, 'UnaryExpression');

  const { argument, prefix, operator } = node;
  assert(prefix);
  assert(supportedUnaryOps.hasOwnProperty(operator), `Unary operator not supported '${operator}'`);
  const op = supportedUnaryOps[operator];

  const argumentResult = evalExpressionNode(argument, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(argumentResult);
};

const evalExpressionNode = (node, typeNames) => {
  switch (node.type) {
    case 'Literal': return evalLiteral(node, typeNames);
    case 'Identifier': return evalIdentifier(node);
    case 'UnaryExpression': return evalUnaryExpression(node);
    case 'BinaryExpression': return evalBinaryExpression(node);
    case 'LogicalExpression': return evalLogicalExpression(node);
    case 'SequenceExpression': return evalSequenceExpression(node);
    case 'ConditionalExpression': return evalConditionalExpression(node);
    default: assert.fail(`Expected one of: 'Literal', 'UnaryExpression', 'BinaryExpression', 'LogicalExpression', 'ConditionalExpression', 'SequenceExpression'`);
  }
};

const evalExpressionStatement = (node, typeNames) => {
  assert.strictEqual(node.type, 'ExpressionStatement');

  const { expression } = node;

  return evalExpressionNode(expression, typeNames);
};

const evalProgram = node => {
  assert.strictEqual(node.type, 'Program');

  const { body } = node;
  assert.strictEqual(body.length, 1);

  const statement = body[0];

  return evalExpressionStatement(statement, [TYPE_NUMBER, TYPE_BOOLEAN]);
};

const evalAst = ast => {
  return evalProgram(ast);
};

const esEval = code => {
  const ast = acorn.parse(code, { ecmaVersion: 2022 });
  return evalAst(ast);
};

module.exports = esEval;
