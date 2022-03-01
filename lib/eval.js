'use strict';

const assert = require('assert');

const TYPE_UNDEFINED = 'undefined';
const TYPE_NUMBER = 'number';
const TYPE_BOOLEAN = 'boolean';
const TYPE_STRING = 'string';

const VARIABLE_TYPE_CONST = 'const';
const VARIABLE_TYPE_LET = 'let';

const NODE_PROGRAM = 'Program';

const NODE_VARIABLE_DECLARATION = 'VariableDeclaration';
const NODE_VARIABLE_DECLARATOR = 'VariableDeclarator';
const NODE_BLOCK_STATEMENT = 'BlockStatement';
const NODE_EXPRESSION_STATEMENT = 'ExpressionStatement';
const NODE_RETURN_STATEMENT = 'ReturnStatement';

const NODE_BINARY_EXPRESSION = 'BinaryExpression';
const NODE_LOGICAL_EXPRESSION = 'LogicalExpression';
const NODE_SEQUENCE_EXPRESSION = 'SequenceExpression';
const NODE_UNARY_EXPRESSION = 'UnaryExpression';
const NODE_CONDITIONAL_EXPRESSION = 'ConditionalExpression';
const NODE_ARROW_FUNCTION_EXPRESSION = 'ArrowFunctionExpression';
const NODE_CALL_EXPRESSION = 'CallExpression';
const NODE_ASSIGNMENT_EXPRESSION = 'AssignmentExpression';

const NODE_IDENTIFIER = 'Identifier';
const NODE_LITERAL = 'Literal';

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
  'delete': x => typeof x === TYPE_NUMBER || typeof x === TYPE_STRING || typeof x === TYPE_BOOLEAN,
};

const supportedAssignmentOps = {
  '=': (varName, value, context) => { context.set(varName, value); return value; },

  // @todo Add support for:
  //   *=
  //   **=
  //   /=
  //   %=
  //   +=
  //   -=
  //   <<=
  //   >>=
  //   >>>=
  //   &=
  //   ^=
  //   |=
  //   &&=
  //   ||=
  //   ??=
};

const evalLiteral = node => {
  assert.strictEqual(node.type, NODE_LITERAL);

  const { value } = node;
  const typeNames = [TYPE_NUMBER, TYPE_BOOLEAN, TYPE_STRING];
  assert(typeNames.includes(typeof value), `Expected one of ${typeNames.map(t => `'${t}'`).join(', ')} as argument`);

  return value;
};

const evalIdentifier = (node, context) => {
  assert.strictEqual(node.type, NODE_IDENTIFIER);

  const { name } = node;

  // If any of 'undefined', 'Infinity', 'NaN' were overridden in current context, the user value is supplied
  return context.get(name);
};

const evalReturnStatement = (node, context) => {
  assert.strictEqual(node.type, NODE_RETURN_STATEMENT);

  const { argument } = node;

  if (argument === null) { return void 0; }

  return evalExpressionNode(argument, context);
};

const evalStatementNode = (node, context) => {
  switch (node.type) {
    case NODE_RETURN_STATEMENT: return evalReturnStatement(node, context);
    case NODE_EXPRESSION_STATEMENT: return evalExpressionStatement(node, context);
    case NODE_VARIABLE_DECLARATION: return evalVariableDeclaration(node, context);
    default: assert.fail(`Expected one of: '${NODE_RETURN_STATEMENT}', '${NODE_EXPRESSION_STATEMENT}', '${NODE_VARIABLE_DECLARATION}'`);
  }
};

const evalBlockStatementNode = (node, context) => {
  assert.strictEqual(node.type, NODE_BLOCK_STATEMENT);

  const { body } = node;

  let blockResult = void 0;

  let instructionPointer = 0;
  let breakExecution = false;
  while (instructionPointer < body.length && !breakExecution) {
    const statement = body[instructionPointer];
    const statementResult = evalStatementNode(statement, context);
    if (statement.type === NODE_RETURN_STATEMENT) {
      blockResult = statementResult;
      breakExecution = true;
    }

    instructionPointer++;
  }

  return blockResult;
};

const evalConditionalExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_CONDITIONAL_EXPRESSION);

  const { test, consequent, alternate } = node;

  const op = (x, y, z) => x ? y : z;

  const testResult = evalExpressionNode(test, context);
  const consequentResult = evalExpressionNode(consequent, context);
  const alternateResult = evalExpressionNode(alternate, context);

  return op(testResult, consequentResult, alternateResult);
};

const evalArrowFunctionExpression = node => {
  assert.strictEqual(node.type, NODE_ARROW_FUNCTION_EXPRESSION);

  const { async, generator, id, params, body } = node;
  // @todo double check meaning of node.expression
  assert.strictEqual(async, false, 'Async arrow functions are not supported');
  assert.strictEqual(generator, false, 'Generator arrow functions are not supported');
  assert.strictEqual(id, null);

  const paramNames = params.map(param => {
    assert.strictEqual(param.type, NODE_IDENTIFIER);
    const { name } = param;
    return name;
  });

  return new implClasses.ArrowFunction(body, paramNames);
};

const evalCallExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_CALL_EXPRESSION);

  const { callee, optional, arguments: callArguments } = node;
  assert.strictEqual(optional, false);

  const calleeFn = evalArrowFunctionExpression(callee);
  const argumentsResults = callArguments.map(exp => evalExpressionNode(exp, context));

  return calleeFn.exec(argumentsResults, context);
};

const evalAssignmentExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_ASSIGNMENT_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedAssignmentOps.hasOwnProperty(operator), `Assignment operator not supported '${operator}'`);

  const op = supportedAssignmentOps[operator];

  assert.strictEqual(left.type, NODE_IDENTIFIER);
  const { name } = left;

  // const leftResult = evalExpressionNode(left, context); // @todo will be required for other kind of assignments
  const rightResult = evalExpressionNode(right, context);

  return op(name, rightResult, context);
};

const evalBinaryExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_BINARY_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedBinaryOps.hasOwnProperty(operator), `Binary operator not supported '${operator}'`);
  const op = supportedBinaryOps[operator];

  const leftResult = evalExpressionNode(left, context);
  const rightResult = evalExpressionNode(right, context);

  return op(leftResult, rightResult);
};

const evalLogicalExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_LOGICAL_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedLogicalOps.hasOwnProperty(operator), `Logical operator not supported '${operator}'`);
  const op = supportedLogicalOps[operator];

  const leftResult = evalExpressionNode(left, context);
  const rightResult = evalExpressionNode(right, context);

  return op(leftResult, rightResult);
};

const evalSequenceExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_SEQUENCE_EXPRESSION);

  const { expressions } = node;
  assert.strictEqual(expressions.length >= 2, true);

  const expressionResults = expressions.map(exp => evalExpressionNode(exp, context));

  return expressionResults[expressionResults.length - 1];
};

const evalUnaryExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_UNARY_EXPRESSION);

  const { argument, prefix, operator } = node;
  assert(prefix);
  assert(supportedUnaryOps.hasOwnProperty(operator), `Unary operator not supported '${operator}'`);
  const op = supportedUnaryOps[operator];

  const argumentResult = evalExpressionNode(argument, context);

  return op(argumentResult);
};

const evalExpressionNode = (node, context) => {
  switch (node.type) {
    case NODE_LITERAL: return evalLiteral(node);
    case NODE_IDENTIFIER: return evalIdentifier(node, context);
    case NODE_UNARY_EXPRESSION: return evalUnaryExpression(node, context);
    case NODE_BINARY_EXPRESSION: return evalBinaryExpression(node, context);
    case NODE_LOGICAL_EXPRESSION: return evalLogicalExpression(node, context);
    case NODE_SEQUENCE_EXPRESSION: return evalSequenceExpression(node, context);
    case NODE_CONDITIONAL_EXPRESSION: return evalConditionalExpression(node, context);
    case NODE_ARROW_FUNCTION_EXPRESSION: return evalArrowFunctionExpression(node);
    case NODE_CALL_EXPRESSION: return evalCallExpression(node, context);
    case NODE_ASSIGNMENT_EXPRESSION: return evalAssignmentExpression(node, context);
    default: assert.fail(`Expected one of: '${NODE_LITERAL}', '${NODE_IDENTIFIER}', '${NODE_UNARY_EXPRESSION}', '${NODE_BINARY_EXPRESSION}', '${NODE_LOGICAL_EXPRESSION}', '${NODE_SEQUENCE_EXPRESSION}', '${NODE_CONDITIONAL_EXPRESSION}', '${NODE_ARROW_FUNCTION_EXPRESSION}', '${NODE_CALL_EXPRESSION}'`);
  }
};

const evalExpressionStatement = (node, context) => {
  assert.strictEqual(node.type, NODE_EXPRESSION_STATEMENT);
  const { expression } = node;
  return evalExpressionNode(expression, context);
};

const evalVariableDeclarator = (node, isConst, context) => {
  assert.strictEqual(node.type, NODE_VARIABLE_DECLARATOR);

  const { id, init } = node;
  assert.strictEqual(id.type, NODE_IDENTIFIER);
  const resultInit = init !== null ? evalExpressionNode(init, context) : void 0;

  const { name } = id;
  context.add(name, resultInit, isConst);
};

const evalVariableDeclaration = (node, context) => {
  assert.strictEqual(node.type, NODE_VARIABLE_DECLARATION);

  const { kind, declarations } = node;
  assert(kind === VARIABLE_TYPE_CONST || kind === VARIABLE_TYPE_LET);

  declarations.forEach(decl => evalVariableDeclarator(decl, kind === VARIABLE_TYPE_CONST, context));

  return void 0;
};


const evalProgram = (node, context) => {
  assert.strictEqual(node.type, NODE_PROGRAM);

  const { body } = node;
  // @todo add test to check empty expression error
  assert.strictEqual(body.length, 1);

  const statement = body[0];

  return evalExpressionStatement(statement, context);
};

module.exports = {
  installImplClasses,
  evalProgram,
  evalExpressionNode,
  evalBlockStatementNode,
  TYPE_NUMBER,
  TYPE_BOOLEAN,
  NODE_BLOCK_STATEMENT,
};
