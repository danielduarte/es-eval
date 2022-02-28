const { evalExpressionNode, TYPE_NUMBER, TYPE_BOOLEAN, NODE_BLOCK_STATEMENT } = require('./eval');

class ArrowFunction {

  constructor(body, paramNames) {
    this.body = body;
    this.paramNames = paramNames;
  }

  exec(params) {
    if (this.body.type === NODE_BLOCK_STATEMENT) {
      return void 0;
    } else {
      const fnContext = this.paramNames.reduce((acc, paramName, i) => { acc[paramName] = params[i]; return acc; }, {});
      return evalExpressionNode(this.body, fnContext, [TYPE_NUMBER, TYPE_BOOLEAN]);
    }
  }
}

module.exports = { ArrowFunction };
