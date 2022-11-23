# es-eval

Evaluate JavaScript expressions safely.
No more being afraid of what the users enter!

:game_die: [Playground](https://danielduarte.github.io/es-eval-playground/) (pre-release version)

## Installation

```bash
npm i es-eval
```

## Usage

```js
// Simple expression
const esEval = require('es-eval');

const result = esEval('1 + 2');
console.log(result); // Output: 3
```

```js
// User values
const esEval = require('es-eval');

const result = esEval('1 + x', { x: 4 });
console.log(result); // Output: 5
```

Or more complex examples:

```js
// IIFE example
const esEval = require('es-eval');

const exp = `(() => {
  const out = [];

  const callback = () => {
    out.push('callback() called');
  };

  const main = function (param, cb) {
    out.push('main() started with param = "' + param + '"');
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

```js
// Hangup protection in infinite loop
const esEval = require('es-eval');

try {
  esEval(`(() => {
    while (true) {}
  })()`);
} catch (err) {
  console.log(err.message); // Output: 'Evaluation timeout'
}
```

# Features

| Feature | Notes |
|---------|-------|
| Hangup protection | The execution of any user inputs is protected against intentional or unintentional hangups. Since it is mathematically proven that the [halting problem] is undecidable, hence it cannot be automatically computed, this protection is based on a configurable timeout. |
| Primitive values | `number`, `string`, `boolean` and `undefined` values. |
| Objects | `{ key: 'value' }`, `null`, built-in static methods: `Object.entries()`, `Object.keys()`, `Object.values()` |
| Arrays | `[1, 2, 3]`, built-in properties and methods: `length`, `push`, `pop`, `shift`, `ushift`, `slice`, `splice`, `forEach`, `map`, `filter`, `reduce`, `includes` |
| Arrow function expressions | `(x, y) => x + y` |
| Standard function expressions | `function () { return 'value'; }` |
| Closures | |
| Nested expressions | `(a < (b + 1) && a - (a < ([1, 2].map(x => 1 + x)).length))`  |
| Callbacks | `cb => { cb(); return 1; }` |
| Mathematical operations | `+`, `-`, `/`, `*`, `%`, `**` |
| Comparators | `===`, `!==`, `==`, `!=`, `<`, `>`, `<=`, `>=` |
| Logical operations | `&&`, <code>&#124;&#124;</code>, `!` |
| Bitwise operations | `&`, <code>&#124;</code>, `^` |
| Ternary operator | `... ? ... : ...` |
| Nullish operator | `??` |
| Variables | `const` and `let` declarations. Assignments. |
| Conditional | [`if...else`] statement. |
| Loops | [`while`] and [`for...of`] statements. |
| [`JSON`] | `JSON.parse()` and `JSON.stringify()`. |
| [`Math`] | [`Math.random()`], [`Math.min()`], [`Math.max()`], [`Math.floor()`], [`Math.ceil()`] and [`Math.round()`]. |
| [Spread operator] (`...`) | Spread syntax for arrays, objects, and parameters. |
| Global functions | [`parseFloat`], [`parseInt`], [`isNaN`] and [`isFinite`]. |

# Coming soon...

| Status | Feature | Notes |
|--------|---------|-------|
| :sweat: In Progress | global [`this`] | Reference to the global object. |
| :sweat: In Progress | [`Array.isArray()`] | Determines whether the passed value is an Array. |
| :sweat: In Progress | [`+=`] operator | Addition assignment. |
| :hourglass_flowing_sand: To-Do | [`Array.from()`] | Creates a copy of an iterable or array-like object. |
| :hourglass_flowing_sand: To-Do | [`Array.of()`] | Creates an array from the arguments. |
| :hourglass_flowing_sand: To-Do | Block evaluation | Run a block code and return the block context variables with the values at the end of the execution. |

# Future features

:incoming_envelope: [Vote](http://etc.ch/YzCv) what's coming on! :bulb: or [Suggest](https://github.com/danielduarte/es-eval/issues/new) your ideas.

| Feature | Notes |
|---------|-------|
| Browser support | |
| `for in` loop | |
| `for (;;)` loop | |
| `do ... while` loop | |
| Destructuring | |
| *And a lot more!...* | |

# How it works?

- It never executes user code passing it to JS engine (no `eval()`, no `new Function(...)`, no `vm`, no other third party engines), making sure the evaluation is safe.
- No access to require/import modules.
- No access to OS features like file system, network, etc.
- No access to global objects.
- All user code is parsed to an AST and analyzed step by step, representing the code statements and functions in own components. No native `function`s are created with the user input.
- All access to global objects is emulated and there's no real access to natives.
- Standard ECMAScript features are implemented and not delegated to the underlying engine.

# What is this for

:white_check_mark: Evaluate user input expressions safely

:white_check_mark: Easily provide a way to enter and evaluate custom conditions

:white_check_mark: Embed JS expressions in template engines

:white_check_mark: Parse custom JS functions once and evaluate them many times

:white_check_mark: Create expressions with context values, including objects and arrays


# What is this **NOT** for

:no_entry: Create entire applications

:no_entry: Replace V8, or other JS engines


[halting problem]:   https://en.wikipedia.org/wiki/Halting_problem
[`this`]:            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
[`+=`]:              https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition_assignment
[`Array.isArray()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
[`Array.from()`]:    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
[`Array.of()`]:      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
[`if...else`]:       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
[`while`]:           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while
[`for...of`]:        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
[`JSON`]:            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
[`Math`]:            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
[`Math.random()`]:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
[`Math.min()`]:      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
[`Math.max()`]:      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
[`Math.floor()`]:    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
[`Math.ceil()`]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil
[`Math.round()`]:    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
[Spread operator]:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[`parseFloat`]:      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
[`parseInt`]:        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
[`isNaN`]:           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
[`isFinite`]:        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite
