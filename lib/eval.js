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
const NODE_IF_STATEMENT = 'IfStatement';
const NODE_WHILE_STATEMENT = 'WhileStatement';
const NODE_EXPRESSION_STATEMENT = 'ExpressionStatement';
const NODE_RETURN_STATEMENT = 'ReturnStatement';
const NODE_EMPTY_STATEMENT = 'EmptyStatement';
const NODE_BINARY_EXPRESSION = 'BinaryExpression';
const NODE_LOGICAL_EXPRESSION = 'LogicalExpression';
const NODE_SEQUENCE_EXPRESSION = 'SequenceExpression';
const NODE_UNARY_EXPRESSION = 'UnaryExpression';
const NODE_CONDITIONAL_EXPRESSION = 'ConditionalExpression';
const NODE_ARROW_FUNCTION_EXPRESSION = 'ArrowFunctionExpression';
const NODE_FUNCTION_EXPRESSION = 'FunctionExpression';
const NODE_CALL_EXPRESSION = 'CallExpression';
const NODE_ASSIGNMENT_EXPRESSION = 'AssignmentExpression';
const NODE_OBJECT_EXPRESSION = 'ObjectExpression';
const NODE_ARRAY_EXPRESSION = 'ArrayExpression';
const NODE_MEMBER_EXPRESSION = 'MemberExpression';
const NODE_THIS_EXPRESSION = 'ThisExpression';
const NODE_SPREAD_ELEMENT = 'SpreadElement';
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
  // @todo(feat) Not supported yet: 'in', 'instanceof'
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
  '&&': (xNode, yNode, context, target, options, runState) => evalExpressionNode(xNode, context, target, options, runState) && evalExpressionNode(yNode, context, target, options, runState),
  '||': (xNode, yNode, context, target, options, runState) => evalExpressionNode(xNode, context, target, options, runState) || evalExpressionNode(yNode, context, target, options, runState),
  '??': (xNode, yNode, context, target, options, runState) => {
    const x = evalExpressionNode(xNode, context, target, options, runState);
    return typeof x === TYPE_UNDEFINED || x === null ? evalExpressionNode(yNode, context, target, options, runState) : x;
  }
};

// @todo(feat) Implement ++ and --
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
  // @todo(test) add test deleting object properties
  'delete': x => [TYPE_NUMBER, TYPE_STRING, TYPE_BOOLEAN, TYPE_OBJECT, TYPE_FUNCTION].includes(typeof x) && !Number.isNaN(x) && x !== Infinity,
};

const supportedAssignmentOps = {
  '=': (varName, value, context) => { context.set(varName, value); return value; },

  // @todo(feat) Add support for:
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

const evalReturnStatement = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_RETURN_STATEMENT);

  const { argument } = node;

  let result = void 0;
  if (argument !== null) {
    result = evalExpressionNode(argument, context, target, options, runState)
  }

  return { result, exit: true };
};

const evalStatementNode = (node, context, target, options, runState) => {
  let result;
  switch (node.type) {
    case NODE_VARIABLE_DECLARATION: { result = evalVariableDeclaration(node, context, target, options, runState); break; }
    case NODE_BLOCK_STATEMENT:      { result = evalBlockStatement(node, context, target, options, runState); break; }
    case NODE_IF_STATEMENT:         { result = evalIfStatement(node, context, target, options, runState); break; }
    case NODE_WHILE_STATEMENT:      { result = evalWhileStatement(node, context, target, options, runState); break; }
    case NODE_RETURN_STATEMENT:     { result = evalReturnStatement(node, context, target, options, runState); break; }
    case NODE_EXPRESSION_STATEMENT: { result = evalExpressionStatement(node, context, target, options, runState); break; }
    case NODE_EMPTY_STATEMENT:      { result = evalEmptyStatement(node); break; }
    default: assert.fail(`Expected one of: '${NODE_VARIABLE_DECLARATION}', ${NODE_BLOCK_STATEMENT}', ${NODE_IF_STATEMENT}', ${NODE_WHILE_STATEMENT}', '${NODE_RETURN_STATEMENT}', '${NODE_EXPRESSION_STATEMENT}', '${NODE_EMPTY_STATEMENT}', but given '${node.type}'`);
  }

  const execTime = Date.now() - runState.startTime;
  assert(execTime < options.timeout, 'Evaluation timeout');

  return result;
};

const evalBlockStatement = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_BLOCK_STATEMENT);

  const { body } = node;

  let blockResult = { result: void 0 };

  let instructionPointer = 0;
  let breakExecution = false;
  while (instructionPointer < body.length && !breakExecution) {
    const statement = body[instructionPointer];
    const statResult = evalStatementNode(statement, context, target, options, runState);
    if (statResult.exit) {
      blockResult = statResult;
      breakExecution = true;
    }

    instructionPointer++;
  }

  return blockResult;
};

const evalIfStatement = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_IF_STATEMENT);

  const { test, consequent, alternate } = node;

  const testResult = evalExpressionNode(test, context, target, options, runState);

  let statResult = { result: void 0 };
  if (testResult) {
    statResult = evalStatementNode(consequent, context, target, options, runState);
  } else if (alternate !== null) {
    statResult = evalStatementNode(alternate, context, target, options, runState);
  }

  return statResult;
};

const evalWhileStatement = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_WHILE_STATEMENT);

  const { test, body } = node;

  let statResult = { result: void 0, exit: false };

  while (!statResult.exit && evalExpressionNode(test, context, target, options, runState)) {
    statResult = evalStatementNode(body, context, target, options, runState);
  }

  return statResult;
};

const evalBuiltInMethodImpl = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_BUILTIN_METHOD_IMPL);
  const { name, targetClass } = node;

  const builtInClassExists = Object.prototype.hasOwnProperty.call(builtInsImpl, targetClass);
  assert(builtInClassExists, `Built-in class or object '${targetClass}' not implemented yet`);
  const builtInMethodExists = Object.prototype.hasOwnProperty.call(builtInsImpl[targetClass], name);
  assert(builtInMethodExists, `Built-in method '${targetClass}.${name}()' not implemented yet`);

  const fn =builtInsImpl[targetClass][name];
  assert(typeof fn === 'function', `Expected built-in property '${targetClass}.${name}' to be a function but '${typeof fn}' given`);

  return fn(target, context, options, runState);
};

const evalConditionalExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_CONDITIONAL_EXPRESSION);

  const { test, consequent, alternate } = node;
  const testResult = evalExpressionNode(test, context, target, options, runState);

  return testResult ? evalExpressionNode(consequent, context, target, options, runState) : evalExpressionNode(alternate, context, target, options, runState);
};

const evalArrowFunctionExpression = (node, context, target) => {
  assert.strictEqual(node.type, NODE_ARROW_FUNCTION_EXPRESSION);
  return createFunction(node, context, target, true);
};

const evalFunctionExpression = (node, context, target) => {
  assert.strictEqual(node.type, NODE_FUNCTION_EXPRESSION);
  return createFunction(node, context, target, false);
};

const createFunction = (node, context, target, isLambda) => {
  const { async, generator, id, params, body } = node; // @todo(chore) double check meaning of node.expression
  assert.strictEqual(async, false, isLambda ? 'Async arrow functions are not supported' : 'Async functions are not supported');
  assert.strictEqual(generator, false, isLambda ? 'Generator arrow functions are not supported' : 'Generator functions are not supported');
  assert.strictEqual(id, null);

  const paramDefs = params.map(param => ({ name: evalIdentifierNode(param) }));

  return new implClasses.GenericFunction(body, paramDefs, target, { isVariadic: false, isLambda, context });
};

const evalCallExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_CALL_EXPRESSION);

  const { callee, optional, arguments: callArguments } = node;
  assert.strictEqual(optional, false);

  const calleeFn = evalExpressionNode(callee, context, target, options, runState);
  assert(calleeFn instanceof implClasses.AbstractFunction, typeof calleeFn !== TYPE_FUNCTION ? `Function expected but given ${typeof calleeFn}` : `Cannot execute a user provided function`);

  const argumentsResults = [];
  for (const arg of callArguments) {
    const argResult = evalExpressionNode(arg, context, target, options, runState);
    const isSpread = arg.type === NODE_SPREAD_ELEMENT;
    if (isSpread) {
      argumentsResults.push(...argResult);
    } else {
      argumentsResults.push(argResult);
    }
  }

  return calleeFn.exec(argumentsResults, context, options, runState);
};

const evalAssignmentExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_ASSIGNMENT_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedAssignmentOps.hasOwnProperty(operator), `Assignment operator not supported '${operator}'`);

  const op = supportedAssignmentOps[operator];

  // const leftResult = evalExpressionNode(left, context, target, options); // @todo(feat) will be required for other kind of assignments
  const rightResult = evalExpressionNode(right, context, target, options, runState);

  if (left.type === NODE_IDENTIFIER) {
    const name = evalIdentifierNode(left);
    return op(name, rightResult, context);
  } else {
    const { object, name, isArray } = evalMemberExpressionNode(left, context, target, options, runState);
    assert(object !== null, `Cannot set properties of null (setting '${name}')`);
    assert(typeof object !== TYPE_UNDEFINED, `Cannot set properties of undefined (setting '${name}')`);

    // Here built-in properties can be written. Ex: Array.length
    if (typeof object !== 'object') {
      return void 0;
    }
    return object[name] = rightResult;
  }
};

const evalProperty = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_PROPERTY);

  const { computed, key, kind, method, shorthand, value } = node;
  assert.strictEqual(kind, 'init'); // @todo(chore) double check meaning of field 'kind'
  assert.strictEqual(method, false, 'Methods are not supported yet'); // @todo(feat) add support for methods
  assert.strictEqual(shorthand, false, 'Shorthand properties are not supported yet'); // @todo(feat) add support for shorthand. Ex objects { a, b } instead of { a: a, b: b }

  let name;
  if (computed) {
    name = evalExpressionNode(key, context, target, options, runState);
  } else {
    switch (key.type) {
      case NODE_LITERAL:    { name = evalLiteral(key); break; }
      case NODE_IDENTIFIER: { name = evalIdentifierNode(key); break; } // Note that here it is called evalIdentifierNode to get the id and not evalIdentifier to get the value
      default: assert.fail(`Expected one of: '${NODE_LITERAL}', '${NODE_IDENTIFIER}', but given '${key.type}'`);
    }
  }

  const propValue = evalExpressionNode(value, context, target, options, runState);

  return { name, value: propValue };
};

const evalObjectExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_OBJECT_EXPRESSION);

  const { properties } = node;

  const resultObject = {};
  for (const prop of properties) {
    const isSpread = prop.type === NODE_SPREAD_ELEMENT;
    if (isSpread) {
      const props = evalSpreadElement(prop, context, target, options, runState);
      const isFunc = props instanceof implClasses.AbstractFunction;
      if (!isFunc) {
        Object.assign(resultObject, props);
      }
    } else {
      const { name, value } = evalProperty(prop, context, target, options, runState);
      resultObject[name] = value;
    }
  }

  return resultObject;
};

const evalArrayExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_ARRAY_EXPRESSION);
  const { elements } = node;

  const resultElements = [];
  for (const elem of elements) {
    const resultElem = evalExpressionNode(elem, context, target, options, runState);
    const isSpread = elem.type === NODE_SPREAD_ELEMENT;
    if (isSpread) {
      assert(Array.isArray(resultElem), 'Value is not iterable');
      resultElements.push(...resultElem);
    } else {
      resultElements.push(resultElem);
    }
  }

  return resultElements;
};

const evalMemberExpression = (node, context, target, options, runState) => {
  const { object, name, isArray } = evalMemberExpressionNode(node, context, target, options, runState);

  assert(typeof object !== 'undefined', `Cannot read properties of undefined (reading '${name}')`);
  assert(object !== null, `Cannot read properties of null (reading '${name}')`);

  // @todo(feat) add support to override built-in members
  const builtInType = isArray ? 'Array' : 'Object';
  const isBuiltInProperty = Object.prototype.hasOwnProperty.call(builtIns[builtInType], name);
  if (isBuiltInProperty) {
    let member = builtIns[builtInType][name];
    if (member instanceof implClasses.AbstractFunction) {
      const finalTarget = member.isLambda ? target : object;
      member = member.bindThis(finalTarget);

      // For error reporting in not implemented yet built-in methods:
      member.targetClass = builtInType;
      member.name = name;
    }
    return member;
  }

  // Supports only access own properties
  const isOwnProperty = Object.prototype.hasOwnProperty.call(object, name);

  // @todo(chore) if object[name] is a function, it should be bound to object (this = object inside the function)
  // Here built-in properties can be read. Ex: Array.length
  if (typeof object !== 'object') {
    return void 0;
  }
  let member = isOwnProperty ? object[name] : void 0;
  if (member instanceof implClasses.AbstractFunction) { // For security reasons, do not remove this check
    const finalTarget = member.isLambda ? target : object;
    member = member.bindThis(finalTarget);
  } else {
    assert(typeof member !== TYPE_FUNCTION, `Cannot access user provided functions`);
  }

  return member;
};

const evalThisExpression = (node, context, target) => {
  assert.strictEqual(node.type, NODE_THIS_EXPRESSION);

  return target;
};

const evalSpreadElement = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_SPREAD_ELEMENT);
  const { argument } = node;

  return evalExpressionNode(argument, context, target, options, runState);
};

const evalMemberExpressionNode = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_MEMBER_EXPRESSION);
  const { computed, object, optional, property } = node;
  assert(optional === false);

  const objectResult = evalExpressionNode(object, context, target, options, runState);
  assert(['object', 'number', 'string', 'boolean', 'undefined'].includes(typeof objectResult), `Unexpected value of type ${typeof objectResult}`); // @todo(feat) support member expressions for non-objects
  assert(!(objectResult instanceof implClasses.AbstractFunction), 'Property read or write on functions is not supported'); // For security reasons, do not remove this check

  const isArray = Array.isArray(objectResult);

  let name;
  if (computed) {
    name = evalExpressionNode(property, context, target, options, runState);
  } else {
    name = evalIdentifierNode(property); // Note that here it is called evalIdentifierNode to get the id and not evalIdentifier to get the value
  }

  return { object: objectResult, name, isArray };
};

const evalBinaryExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_BINARY_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedBinaryOps.hasOwnProperty(operator), `Binary operator not supported '${operator}'`);
  const op = supportedBinaryOps[operator];

  const leftResult = evalExpressionNode(left, context, target, options, runState);
  const rightResult = evalExpressionNode(right, context, target, options, runState);

  return op(leftResult, rightResult);
};

const evalLogicalExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_LOGICAL_EXPRESSION);

  const { left, right, operator } = node;
  assert(supportedLogicalOpsWithShortCircuit.hasOwnProperty(operator), `Logical operator not supported '${operator}'`);
  const op = supportedLogicalOpsWithShortCircuit[operator];

  return op(left, right, context, target, options, runState);
};

const evalSequenceExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_SEQUENCE_EXPRESSION);

  const { expressions } = node;
  assert.strictEqual(expressions.length >= 2, true);

  // @todo(refactor) improve this code
  const expressionResults = expressions.map(exp => evalExpressionNode(exp, context, target, options, runState));

  return expressionResults[expressionResults.length - 1];
};

const evalUnaryExpression = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_UNARY_EXPRESSION);

  const { argument, prefix, operator } = node;
  assert(prefix);
  assert(supportedUnaryOps.hasOwnProperty(operator), `Unary operator not supported '${operator}'`);
  const op = supportedUnaryOps[operator];

  let argumentResult = evalExpressionNode(argument, context, target, options, runState);

  if (argumentResult instanceof implClasses.AbstractFunction) {
    // @todo(chore) review this code
    argumentResult = () => {}; // All unary operators returns the same result for unary operators
  }

  return op(argumentResult);
};

const evalExpressionNode = (node, context, target, options, runState) => {
  switch (node.type) {
    case NODE_LITERAL:                   return evalLiteral(node);
    case NODE_IDENTIFIER:                return evalIdentifier(node, context);
    case NODE_UNARY_EXPRESSION:          return evalUnaryExpression(node, context, target, options, runState);
    case NODE_BINARY_EXPRESSION:         return evalBinaryExpression(node, context, target, options, runState);
    case NODE_LOGICAL_EXPRESSION:        return evalLogicalExpression(node, context, target, options, runState);
    case NODE_SEQUENCE_EXPRESSION:       return evalSequenceExpression(node, context, target, options, runState);
    case NODE_CONDITIONAL_EXPRESSION:    return evalConditionalExpression(node, context, target, options, runState);
    case NODE_ARROW_FUNCTION_EXPRESSION: return evalArrowFunctionExpression(node, context, target);
    case NODE_FUNCTION_EXPRESSION:       return evalFunctionExpression(node, context, target);
    case NODE_CALL_EXPRESSION:           return evalCallExpression(node, context, target, options, runState);
    case NODE_ASSIGNMENT_EXPRESSION:     return evalAssignmentExpression(node, context, target, options, runState);
    case NODE_OBJECT_EXPRESSION:         return evalObjectExpression(node, context, target, options, runState);
    case NODE_ARRAY_EXPRESSION:          return evalArrayExpression(node, context, target, options, runState);
    case NODE_MEMBER_EXPRESSION:         return evalMemberExpression(node, context, target, options, runState);
    case NODE_THIS_EXPRESSION:           return evalThisExpression(node, context, target);
    case NODE_SPREAD_ELEMENT:            return evalSpreadElement(node, context, target, options, runState);
    default: assert.fail(`Expected one of: '${NODE_LITERAL}', '${NODE_IDENTIFIER}', '${NODE_UNARY_EXPRESSION}', '${NODE_BINARY_EXPRESSION}', '${NODE_LOGICAL_EXPRESSION}', '${NODE_SEQUENCE_EXPRESSION}', '${NODE_CONDITIONAL_EXPRESSION}', '${NODE_ARROW_FUNCTION_EXPRESSION}', '${NODE_FUNCTION_EXPRESSION}', '${NODE_CALL_EXPRESSION}', '${NODE_ASSIGNMENT_EXPRESSION}', '${NODE_OBJECT_EXPRESSION}', '${NODE_ARRAY_EXPRESSION}', '${NODE_MEMBER_EXPRESSION}', '${NODE_THIS_EXPRESSION}', '${NODE_SPREAD_ELEMENT}', but given '${node.type}'`);
  }
};

const evalExpressionStatement = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_EXPRESSION_STATEMENT);
  const { expression } = node;
  return { result: evalExpressionNode(expression, context, target, options, runState) };
};

const evalVariableDeclarator = (node, isConst, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_VARIABLE_DECLARATOR);

  const { id, init } = node;
  const name = evalIdentifierNode(id);
  const resultInit = init !== null ? evalExpressionNode(init, context, target, options, runState) : void 0;

  context.add(name, resultInit, isConst);
};

const evalVariableDeclaration = (node, context, target, options, runState) => {
  assert.strictEqual(node.type, NODE_VARIABLE_DECLARATION);

  const { kind, declarations } = node;
  assert(kind === VARIABLE_TYPE_CONST || kind === VARIABLE_TYPE_LET);

  declarations.forEach(decl => evalVariableDeclarator(decl, kind === VARIABLE_TYPE_CONST, context, target, options, runState));

  return { result: void 0 };
};

const evalEmptyStatement = node => {
  assert.strictEqual(node.type, NODE_EMPTY_STATEMENT);
  return { result: void 0 };
};

const evalProgram = (node, context, options, runState) => {
  assert.strictEqual(node.type, NODE_PROGRAM);

  const { body } = node;
  // @todo(test) add test to check empty expression error
  assert.strictEqual(body.length, 1);
  const statement = body[0];

  const globalThis = {};
  const { result } = evalExpressionStatement(statement, context, globalThis, options, runState);

  return result;
};

module.exports = {
  installImplClasses,
  installBuiltIns,
  evalProgram,
  evalExpressionNode,
  evalBlockStatement,
  evalBuiltInMethodImpl,
  TYPE_NUMBER,
  TYPE_BOOLEAN,
  NODE_BLOCK_STATEMENT,
  NODE_BUILTIN_METHOD_IMPL,
};
