const { evalExpressionNode, evalBlockStatementNode, NODE_BLOCK_STATEMENT } = require('./eval');
const { Context } = require('./context');

class ArrowFunction {

  constructor(body, paramNames) {
    this.body = body;
    this.paramNames = paramNames;
  }

  exec(params, context) {
    const fnVars = this.paramNames.reduce((acc, paramName, i) => { acc[paramName] = { value: params[i], isConst: false }; return acc; }, {});
    const fnContext = new Context(fnVars, context);

    if (this.body.type === NODE_BLOCK_STATEMENT) {
      return evalBlockStatementNode(this.body, fnContext);
    } else {
      return evalExpressionNode(this.body, fnContext);
    }
  }
}

module.exports = { ArrowFunction };
