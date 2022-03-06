'use strict';

const assert = require('assert');

const TYPE_UNDEFINED = 'undefined';
const TYPE_NUMBER = 'number';
const TYPE_BOOLEAN = 'boolean';
const TYPE_STRING = 'string';
const TYPE_OBJECT = 'object';
const TYPE_FUNCTION = 'function';

const VARIABLE_TYPE_CONST = 'const';
const VARIABLE_TYPE_LET = 'let';

const NODE_PROGRAM = 'Program';

const NODE_VARIABLE_DECLARATION = 'VariableDeclaration';
const NODE_VARIABLE_DECLARATOR = 'VariableDeclarator';
const NODE_BLOCK_STATEMENT = 'BlockStatement';
const NODE_EXPRESSION_STATEMENT = 'ExpressionStatement';
const NODE_RETURN_STATEMENT = 'ReturnStatement';
const NODE_EMPTY_STATEMENT = 'EmptyStatement';

const NODE_BINARY_EXPRESSION = 'BinaryExpression';
const NODE_LOGICAL_EXPRESSION = 'LogicalExpression';
const NODE_SEQUENCE_EXPRESSION = 'SequenceExpression';
const NODE_UNARY_EXPRESSION = 'UnaryExpression';
const NODE_CONDITIONAL_EXPRESSION = 'ConditionalExpression';
const NODE_ARROW_FUNCTION_EXPRESSION = 'ArrowFunctionExpression';
const NODE_CALL_EXPRESSION = 'CallExpression';
const NODE_ASSIGNMENT_EXPRESSION = 'AssignmentExpression';
const NODE_OBJECT_EXPRESSION = 'ObjectExpression';
const NODE_ARRAY_EXPRESSION = 'ArrayExpression';
const NODE_MEMBER_EXPRESSION = 'MemberExpression';
const NODE_PROPERTY = 'Property';

const NODE_IDENTIFIER = 'Identifier';
const NODE_LITERAL = 'Literal';

const NODE_BUILTIN_METHOD_IMPL = 'BuiltInMethodImpl';

const implClasses = {};
const builtIns = {};
const builtInsImpl = {};

const installImplClasses = classes => {
  Object.assign(implClasses, classes);
};

const installBuiltIns = (classes, impls) => {
  Object.assign(builtIns, classes);
  Object.assign(builtInsImpl, impls);
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

const supportedLogicalOpsWithShortCircuit = {
  // Logical
  '&&': (xNode, yNode, context) => evalExpressionNode(xNode, context) && evalExpressionNode(yNode, context),
  '||': (xNode, yNode, context) => evalExpressionNode(xNode, context) || evalExpressionNode(yNode, context),
  '??': (xNode, yNode, context) => {
    const x = evalExpressionNode(xNode, context);
    return typeof x === TYPE_UNDEFINED || x === null ? evalExpressionNode(yNode, context) : x;
  }
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
  'delete': x => [TYPE_NUMBER, TYPE_STRING, TYPE_BOOLEAN, TYPE_OBJECT, TYPE_FUNCTION].includes(typeof x),
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
  assert(value === null || typeNames.includes(typeof value), `Expected one of ${typeNames.map(t => `'${t}'`).join(', ')} or null as argument`);

  return value;
};

const evalIdentifier = (node, context) => {
  const name = evalIdentifierNode(node);

  // If any of 'undefined', 'Infinity', 'NaN' were overridden in current context, the user value is supplied
  return context.get(name);
};

const evalIdentifierNode = node => {
  assert.strictEqual(node.type, NODE_IDENTIFIER);
  const { name } = node;

  return name;
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
    case NODE_EMPTY_STATEMENT: return evalEmptyStatement(node);
    default: assert.fail(`Expected one of: '${NODE_RETURN_STATEMENT}', '${NODE_EXPRESSION_STATEMENT}', '${NODE_VARIABLE_DECLARATION}', '${NODE_EMPTY_STATEMENT}'`);
  }
};

const evalBlockStatementNode = (node, context) => {
  assert.strictEqual(node.type, NODE_BLOCK_STATEMENT);
  // @todo support 'this' inside a body function

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

const evalBuiltInMethodImpl = (node, context, target) => {
  assert.strictEqual(node.type, NODE_BUILTIN_METHOD_IMPL);

  const { name, targetClass } = node;

  return builtInsImpl[targetClass][name](target, context);
};

const evalConditionalExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_CONDITIONAL_EXPRESSION);

  const { test, consequent, alternate } = node;
  const testResult = evalExpressionNode(test, context);

  return testResult ? evalExpressionNode(consequent, context) : evalExpressionNode(alternate, context);
};

const evalArrowFunctionExpression = node => {
  assert.strictEqual(node.type, NODE_ARROW_FUNCTION_EXPRESSION);

  const { async, generator, id, params, body } = node;
  // @todo double check meaning of node.expression
  assert.strictEqual(async, false, 'Async arrow functions are not supported');
  assert.strictEqual(generator, false, 'Generator arrow functions are not supported');
  assert.strictEqual(id, null);

  const paramNames = params.map(param => evalIdentifierNode(param));

  return new implClasses.ArrowFunction(body, paramNames);
};

const evalCallExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_CALL_EXPRESSION);

  const { callee, optional, arguments: callArguments } = node;
  assert.strictEqual(optional, false);

  const calleeFn = evalExpressionNode(callee, context);
  assert(calleeFn instanceof implClasses.ArrowFunction, 'Not a function');

  const argumentsResults = callArguments.map(exp => evalExpressionNode(exp, context));

  // @todo make target (3rd param now in void 0) to be the "this" target if the function to be called in bound (for example if it si a method call over an object)
  return calleeFn.exec(argumentsResults, context, void 0);
};

const evalAssignmentExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_ASSIGNMENT_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedAssignmentOps.hasOwnProperty(operator), `Assignment operator not supported '${operator}'`);

  const op = supportedAssignmentOps[operator];

  // const leftResult = evalExpressionNode(left, context); // @todo will be required for other kind of assignments
  const rightResult = evalExpressionNode(right, context);

  if (left.type === NODE_IDENTIFIER) {
    const name = evalIdentifierNode(left);
    return op(name, rightResult, context);
  } else {
    const { object, name, isArray } = evalMemberExpressionNode(left, context);

    // Here built-in properties can be written. Ex: Array.length
    return object[name] = rightResult;
  }
};

const evalProperty = (node, context) => {
  assert.strictEqual(node.type, NODE_PROPERTY);

  const { computed, key, kind, method, shorthand, value } = node;
  assert.strictEqual(kind, 'init'); // @todo double check meaning of field 'kind'
  assert.strictEqual(method, false); // @todo double check meaning of field 'method'
  assert.strictEqual(shorthand, false, 'Shorthand properties are not supported yet'); // @todo add support for shorthand. Ex objects { a, b } instead of { a: a, b: b }

  let name;
  if (computed) {
    name = evalExpressionNode(key, context);
  } else {
    switch (key.type) {
      case NODE_LITERAL:    { name = evalLiteral(key); break; }
      case NODE_IDENTIFIER: { name = evalIdentifierNode(key, context); break; } // Note that here it is called evalIdentifierNode to get the id and not evalIdentifier to get the value
      default: assert.fail(`Expected one of: '${NODE_LITERAL}', '${NODE_IDENTIFIER}'`);
    }
  }

  const propValue = evalExpressionNode(value, context);

  return { name, value: propValue };
};

const evalObjectExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_OBJECT_EXPRESSION);

  const { properties } = node;

  return properties.reduce((acc, prop) => {
    const { name, value } = evalProperty(prop, context);
    acc[name] = value;
    return acc;
  }, {});
};

const evalArrayExpression = (node, context) => {
  assert.strictEqual(node.type, NODE_ARRAY_EXPRESSION);
  const { elements } = node;

  return elements.map(element => evalExpressionNode(element, context));
};

const evalMemberExpression = (node, context) => {
  const { object, name, isArray } = evalMemberExpressionNode(node, context);

  // @todo add support to override built-in members
  const builtInType = isArray ? 'Array' : 'Object';
  const isBuiltInProperty = Object.prototype.hasOwnProperty.call(builtIns[builtInType], name);
  if (isBuiltInProperty) {
    let member = builtIns[builtInType][name];
    if (member instanceof implClasses.ArrowFunction) {
      member = member.bindThis(object);
    }
    return member;
  }

  // Supports only access own properties
  const isOwnProperty = Object.prototype.hasOwnProperty.call(object, name);

  // @todo if object[name] is a function, it should be bound to object (this = object inside the function)
  // Here built-in properties can be read. Ex: Array.length
  return isOwnProperty ? object[name] : void 0;
};

const evalMemberExpressionNode = (node, context) => {
  assert.strictEqual(node.type, NODE_MEMBER_EXPRESSION);
  const { computed, object, optional, property } = node;
  assert(optional === false);

  const objectResult = evalExpressionNode(object, context);
  assert(typeof objectResult === 'object'); // @todo support member expressions for non-objects
  assert(!(objectResult instanceof implClasses.ArrowFunction), 'Property assignment to functions is not supported');
  // assert(objectResult !== null); // @todo add when supporting null

  const isArray = Array.isArray(objectResult);

  let name;
  if (computed) {
    name = evalExpressionNode(property, context);
  } else {
    name = evalIdentifierNode(property, context); // Note that here it is called evalIdentifierNode to get the id and not evalIdentifier to get the value
  }

  return { object: objectResult, name, isArray };
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
  assert(supportedLogicalOpsWithShortCircuit.hasOwnProperty(operator), `Logical operator not supported '${operator}'`);
  const op = supportedLogicalOpsWithShortCircuit[operator];

  return op(left, right, context);
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

  let argumentResult = evalExpressionNode(argument, context);

  if (argumentResult instanceof implClasses.ArrowFunction) {
    argumentResult = () => {}; // All unary operators returns the same result for unary operators
  }

  return op(argumentResult);
};

const evalExpressionNode = (node, context) => {
  switch (node.type) {
    case NODE_LITERAL:                   return evalLiteral(node);
    case NODE_IDENTIFIER:                return evalIdentifier(node, context);
    case NODE_UNARY_EXPRESSION:          return evalUnaryExpression(node, context);
    case NODE_BINARY_EXPRESSION:         return evalBinaryExpression(node, context);
    case NODE_LOGICAL_EXPRESSION:        return evalLogicalExpression(node, context);
    case NODE_SEQUENCE_EXPRESSION:       return evalSequenceExpression(node, context);
    case NODE_CONDITIONAL_EXPRESSION:    return evalConditionalExpression(node, context);
    case NODE_ARROW_FUNCTION_EXPRESSION: return evalArrowFunctionExpression(node);
    case NODE_CALL_EXPRESSION:           return evalCallExpression(node, context);
    case NODE_ASSIGNMENT_EXPRESSION:     return evalAssignmentExpression(node, context);
    case NODE_OBJECT_EXPRESSION:         return evalObjectExpression(node, context);
    case NODE_ARRAY_EXPRESSION:          return evalArrayExpression(node, context);
    case NODE_MEMBER_EXPRESSION:         return evalMemberExpression(node, context);
    default: assert.fail(`Expected one of: '${NODE_LITERAL}', '${NODE_IDENTIFIER}', '${NODE_UNARY_EXPRESSION}', '${NODE_BINARY_EXPRESSION}', '${NODE_LOGICAL_EXPRESSION}', '${NODE_SEQUENCE_EXPRESSION}', '${NODE_CONDITIONAL_EXPRESSION}', '${NODE_ARROW_FUNCTION_EXPRESSION}', '${NODE_CALL_EXPRESSION}', '${NODE_ASSIGNMENT_EXPRESSION}', '${NODE_OBJECT_EXPRESSION}', '${NODE_ARRAY_EXPRESSION}', '${NODE_MEMBER_EXPRESSION}'`);
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
  const name = evalIdentifierNode(id);
  const resultInit = init !== null ? evalExpressionNode(init, context) : void 0;

  context.add(name, resultInit, isConst);
};

const evalVariableDeclaration = (node, context) => {
  assert.strictEqual(node.type, NODE_VARIABLE_DECLARATION);

  const { kind, declarations } = node;
  assert(kind === VARIABLE_TYPE_CONST || kind === VARIABLE_TYPE_LET);

  declarations.forEach(decl => evalVariableDeclarator(decl, kind === VARIABLE_TYPE_CONST, context));

  return void 0;
};

const evalEmptyStatement = node => {
  assert.strictEqual(node.type, NODE_EMPTY_STATEMENT);
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
  installBuiltIns,
  evalProgram,
  evalExpressionNode,
  evalBlockStatementNode,
  evalBuiltInMethodImpl,
  TYPE_NUMBER,
  TYPE_BOOLEAN,
  NODE_BLOCK_STATEMENT,
  NODE_BUILTIN_METHOD_IMPL,
};
