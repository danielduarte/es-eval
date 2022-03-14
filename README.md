# es-eval

Evaluate JavaScript expressions safely.
No more being afraid of what the users enter!

## Installation

```bash
npm i es-eval
```

## Usage

```js
const esEval = require('es-eval');
const result = esEval('1 + 2');
console.log(result); // Output: 3
```

Or a more complex example:

```js
const exp = `(() => {
  const out = [];

  const callback = function () {
    out.push('Callback called!');
  };

  const main = function (param, cb) {
    out.push('main() called with ' + param);
    cb();
    out.push('main() finished');
  };

  main('My value', callback);

  return out;
})()`;

console.log(esEval(exp));
// Output: [
//   'main() called with My value',
//   'Callback called!',
//   'main() finished'
// ]
```

# Features

| Feature | Notes |
|---------|-------|
| Primitive values | `number`, `string`, `boolean` and `undefined` values. |
| Objects | |
| Arrays | |
| Arrow function expressions | |
| Standard function expressions | |
| Nested expressions | |
| Callbacks | |
| Mathematical operations | |
| Logical operations | |
| Bitwise operations | |
| Ternary operator | |
| Nullish operator | |
| Variables | `const` and `let` declarations. Assignments. |

# Coming soon...

| Status | Feature | Notes |
|--------|---------|-------|
| :white_check_mark: Ready to Release | Hangup protection | The execution of any user inputs is protected against intentional or unintentional hangups. Since it is mathematically proven that the [halting problem](https://en.wikipedia.org/wiki/Halting_problem) is undecidable, hence it cannot be automatically computed, this protection is based on a configurable timeout. |
| :white_check_mark: Ready to Release | `while` loop | The [`while`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while) statement. |
| :white_check_mark: Ready to Release | [`Array.prototype.includes`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) | Array method to determine is an array includes a value. |
| :sweat: In Progress | [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) | Array method to filter elements with a user callback. |
| :hourglass_flowing_sand: To-Do | [Spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (`...`) | Spread syntax for arrays, objects, and parameters. |
| :hourglass_flowing_sand: To-Do | [`JSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) global object | Functionality to parse and serialize JSON (`JSON.parse(...)` and `JSON.stringify(...)`). |
| :hourglass_flowing_sand: To-Do | `Object` static methods | Static functionality provided by `Object` class. |
| :hourglass_flowing_sand: To-Do | `String.prototype.trim` | String trim method. |
| :hourglass_flowing_sand: To-Do | `parseFloat` | Global function to convert a value into a floating point number. |

# Future features

:incoming_envelope: [Vote](http://etc.ch/YzCv) what's coming on! :bulb: or [Suggest](https://github.com/danielduarte/es-eval/issues/new) your ideas.

| Feature | Notes |
|---------|-------|
| Browser support | |
| `for of` loop | |
| `for in` loop | |
| `for (;;)` loop | |
| `do ... while` loop | |
| *And a lot more!...* | |

# How it works?

- It never executes user code passing it to JS engine (no `eval()`, no `new Function(...)`, no `vm`, no other third party engines), making sure the evaluation is safe.
- No access to require/import modules.
- No access to OS features like file system, network, etc.
- No access to global objects.
- All user code is parsed to an AST and analyzed step by step, representing the code statements and functions in own components. No native `function`s are created with the user input.
- All access to global objects is emulated and there's no real access to natives.
- All standard ECMAScript features are implemented and not delegated to the underlying engine.

# What is this for

:white_check_mark: Evaluate user input expressions safely

:white_check_mark: Easily provide a way to enter and evaluate custom conditions 

:white_check_mark: Embed JS expressions in template engines

:white_check_mark: Parse custom JS functions once and evaluate them many times

:white_check_mark: Create expressions with context values, including objects and arrays


# What is this **NOT** for

:no_entry: Create entire applications

:no_entry: Replace V8, or other JS engines
