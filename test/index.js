// Test files in order of execution

// -- General
require('./general/module');

// -- Literals
require('./expressions/literals');

// -- Operators
require('./operators/unary-ops');
require('./operators/binary-ops');
require('./operators/ternary-ops');
require('./operators/short-circuit');

// -- Functions
require('./functions/lambda-basic');
require('./functions/lambda-scopes');
require('./functions/lambda-code-block');
require('./functions/lambda-methods');
require('./functions/func-exps-basic');
require('./functions/func-exps-code-block');
require('./functions/func-exps-scopes');
require('./functions/func-exps-methods');

// -- Expressions
require('./expressions/nested');
require('./expressions/objects');
require('./expressions/spread');

// -- Variables and constants
require('./vars/const');
require('./vars/let');
require('./vars/assign');
require('./vars/user-vars');
require('./vars/closures');

// -- Built-ins
require('./built-in/string');
require('./built-in/array');
require('./built-in/object');
require('./built-in/json');
require('./built-in/math');
require('./built-in/functions');

// -- Special expressions
require('./general/this');

// -- Statements
require('./statements/blocks');
require('./statements/if');
require('./statements/while');
require('./statements/for-of');

// -- Other
require('./general/halting');
require('./general/random-expressions');
