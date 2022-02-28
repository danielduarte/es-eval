'use strict';

const assert = require('assert');

const TYPE_UNDEFINED = 'undefined';
const TYPE_NUMBER = 'number';
const TYPE_BOOLEAN = 'boolean';

const NODE_PROGRAM = 'Program';
const NODE_BLOCK_STATEMENT = 'BlockStatement';
const NODE_EXPRESSION_STATEMENT = 'ExpressionStatement';
const NODE_BINARY_EXPRESSION = 'BinaryExpression';
const NODE_LOGICAL_EXPRESSION = 'LogicalExpression';
const NODE_SEQUENCE_EXPRESSION = 'SequenceExpression';
const NODE_UNARY_EXPRESSION = 'UnaryExpression';
const NODE_CONDITIONAL_EXPRESSION = 'ConditionalExpression';
const NODE_ARROW_FUNCTION_EXPRESSION = 'ArrowFunctionExpression';
const NODE_IDENTIFIER = 'Identifier';
const NODE_LITERAL = 'Literal';

const INFINITY = 'Infinity';
const NAN = 'NaN';

const implClasses = {};

const installImplClasses = classes => {
  Object.assign(implClasses, classes);
};

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
  '??': (x, y) => typeof x === TYPE_UNDEFINED || x === null ? y : x,
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
  'delete': x => typeof x === TYPE_NUMBER || typeof x === TYPE_BOOLEAN,
};

const evalLiteral = (node, typeNames) => {
  assert.strictEqual(node.type, NODE_LITERAL);

  const { value } = node;
  assert(typeNames.includes(typeof value), `Expected one of ${typeNames.map(t => `'${t}'`).join(', ')} as argument`);

  return value;
};

const evalIdentifier = (node) => {
  assert.strictEqual(node.type, NODE_IDENTIFIER);

  const { name } = node;

  switch (name) {
    case TYPE_UNDEFINED: return void 0;
    case INFINITY: return Infinity; // @todo check Infinity is not overridden
    case NAN: return NaN; // @todo check NaN is not overridden
    default: assert.fail(`Expected one of: '${TYPE_UNDEFINED}', '${INFINITY}', '${NAN}'`);
  }
  // @todo make sure neither of 'undefined', 'Infinity', 'NaN' are not being used as identifier
};

const evalBlockStatementNode = (node) => {
  assert.strictEqual(node.type, NODE_BLOCK_STATEMENT);

  const { body } = node;
  assert.strictEqual(body.length, 0);
};

const evalConditionalExpression = node => {
  assert.strictEqual(node.type, NODE_CONDITIONAL_EXPRESSION);

  const { test, consequent, alternate } = node;

  const op = (x, y, z) => x ? y : z;

  const testResult = evalExpressionNode(test, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const consequentResult = evalExpressionNode(consequent, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const alternateResult = evalExpressionNode(alternate, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(testResult, consequentResult, alternateResult);
};

const evalArrowFunctionExpression = node => {
  assert.strictEqual(node.type, NODE_ARROW_FUNCTION_EXPRESSION);

  const { async, body, generator, id, params } = node;
  assert.strictEqual(async, false, 'Async arrow functions are not supported');
  assert.strictEqual(generator, false, 'Generator arrow functions are not supported');
  assert.strictEqual(id, null);
  assert.strictEqual(params.length, 0);

  return new implClasses.ArrowFunction(body);
};

const evalBinaryExpression = node => {
  assert.strictEqual(node.type, NODE_BINARY_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedBinaryOps.hasOwnProperty(operator), `Binary operator not supported '${operator}'`);
  const op = supportedBinaryOps[operator];

  const leftResult = evalExpressionNode(left, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const rightResult = evalExpressionNode(right, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(leftResult, rightResult);
};

const evalLogicalExpression = node => {
  assert.strictEqual(node.type, NODE_LOGICAL_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedLogicalOps.hasOwnProperty(operator), `Logical operator not supported '${operator}'`);
  const op = supportedLogicalOps[operator];

  const leftResult = evalExpressionNode(left, [TYPE_NUMBER, TYPE_BOOLEAN]);
  const rightResult = evalExpressionNode(right, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(leftResult, rightResult);
};

const evalSequenceExpression = node => {
  assert.strictEqual(node.type, NODE_SEQUENCE_EXPRESSION);

  const { expressions } = node;
  assert.strictEqual(expressions.length >= 2, true);

  const expressionResults = expressions.map(exp => evalExpressionNode(exp, [TYPE_NUMBER, TYPE_BOOLEAN]));

  return expressionResults[expressionResults.length - 1];
};

const evalUnaryExpression = node => {
  assert.strictEqual(node.type, NODE_UNARY_EXPRESSION);

  const { argument, prefix, operator } = node;
  assert(prefix);
  assert(supportedUnaryOps.hasOwnProperty(operator), `Unary operator not supported '${operator}'`);
  const op = supportedUnaryOps[operator];

  const argumentResult = evalExpressionNode(argument, [TYPE_NUMBER, TYPE_BOOLEAN]);

  return op(argumentResult);
};

const evalExpressionNode = (node, typeNames) => {
  switch (node.type) {
    case NODE_LITERAL: return evalLiteral(node, typeNames);
    case NODE_IDENTIFIER: return evalIdentifier(node);
    case NODE_UNARY_EXPRESSION: return evalUnaryExpression(node);
    case NODE_BINARY_EXPRESSION: return evalBinaryExpression(node);
    case NODE_LOGICAL_EXPRESSION: return evalLogicalExpression(node);
    case NODE_SEQUENCE_EXPRESSION: return evalSequenceExpression(node);
    case NODE_CONDITIONAL_EXPRESSION: return evalConditionalExpression(node);
    case NODE_ARROW_FUNCTION_EXPRESSION: return evalArrowFunctionExpression(node);
    default: assert.fail(`Expected one of: '${NODE_LITERAL}', '${NODE_IDENTIFIER}', '${NODE_UNARY_EXPRESSION}', '${NODE_BINARY_EXPRESSION}', '${NODE_LOGICAL_EXPRESSION}', '${NODE_SEQUENCE_EXPRESSION}', '${NODE_CONDITIONAL_EXPRESSION}'`);
  }
};

const evalExpressionStatement = (node, typeNames) => {
  assert.strictEqual(node.type, NODE_EXPRESSION_STATEMENT);

  const { expression } = node;

  return evalExpressionNode(expression, typeNames);
};

const evalProgram = node => {
  assert.strictEqual(node.type, NODE_PROGRAM);

  const { body } = node;
  assert.strictEqual(body.length, 1);

  const statement = body[0];

  return evalExpressionStatement(statement, [TYPE_NUMBER, TYPE_BOOLEAN]);
};

module.exports = {
  installImplClasses,
  evalProgram,
  evalExpressionNode,
  TYPE_NUMBER,
  TYPE_BOOLEAN,
  NODE_BLOCK_STATEMENT,
};
