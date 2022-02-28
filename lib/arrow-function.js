const { evalExpressionNode, TYPE_NUMBER, TYPE_BOOLEAN, NODE_BLOCK_STATEMENT } = require('./eval');

class ArrowFunction {

  constructor(body) {
    this.body = body;
  }

  exec(params) {
    if (this.body.type === NODE_BLOCK_STATEMENT) {
      return void 0;
    } else {
      return evalExpressionNode(this.body, [TYPE_NUMBER, TYPE_BOOLEAN]);
    }
  }
}

module.exports = { ArrowFunction };
