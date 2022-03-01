const { evalExpressionNode, evalBlockStatementNode, TYPE_NUMBER, TYPE_BOOLEAN, NODE_BLOCK_STATEMENT } = require('./eval');
const { Context } = require('./context');

class ArrowFunction {

  constructor(body, paramNames) {
    this.body = body;
    this.paramNames = paramNames;
  }

  exec(params, context) {
    const typeNames = [TYPE_NUMBER, TYPE_BOOLEAN];

    const fnVars = this.paramNames.reduce((acc, paramName, i) => { acc[paramName] = params[i]; return acc; }, {});
    const fnContext = new Context(fnVars, context);

    if (this.body.type === NODE_BLOCK_STATEMENT) {
      return evalBlockStatementNode(this.body, fnContext, typeNames);
    } else {
      return evalExpressionNode(this.body, fnContext, typeNames);
    }
  }
}

module.exports = { ArrowFunction };
