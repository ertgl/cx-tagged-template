# cx-tagged-template

The initial specification and implementation of a sophisticated
class-name-expression language, named as CX, written in TypeScript and released
under the permissive [MIT](https://opensource.org/license/mit) license.

## Introduction

CX (class-expressions) or CXL (class-expression language) is a concatenative
domain-specific language for constructing class-name expressions with a
minimal, yet, expressive syntax.

The language is initially designed to be used with tagged template literals in
JavaScript, but it can also be implemented in other languages that support
user-defined
[sigils](https://en.wikipedia.org/wiki/Macro_(computer_science)),
[macros](https://en.wikipedia.org/wiki/Macro_(computer_science)),
or other forms of syntactic extensions.

> At the early stages of CX's design process, the language was not inspired by
> concatenative programming concepts. However, as it evolved, I found myself
> aligning with the principles of concatenative programming languages and
> decided to embrace them. Since CX focuses only on class-name expressions, it
> is tuned to be more developer-friendly on this specific purpose. For example,
> in CX, line-feeds are considered as emit operators, and non-string
> interpolations are considered as test operators. This design choice provides
> a better developer experience by reducing keystrokes, boilerplate codes, and
> cognitive load; while increasing the expressiveness. Apart from these
> differences, CX's syntax and semantics can be considered as a subset of other
> concatenative programming languages like Forth.

<details>
  <summary>
    <strong>
      Example: Using non-string values as conditional expressions
    </strong>
  </summary>

  ```js
  // When a non-string value is used as an interpolation, it will be evaluated
  // as a conditional expression. If the value is truthy, the preceding values
  // will be emitted to the renderer. Otherwise, the values will be discarded.
  //
  // This type of interpolation does not require the placeholder to be
  // separated with whitespaces. However, it is recommended to use whitespaces
  // for better readability.

  const bordered = false;

  cx`
  nice${!bordered}
  bordered ${bordered}
  ` // "nice"
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Using interpolations for string concatenations
    </strong>
  </summary>

  ```js
  // When a string value is used as an interpolation where the placeholder is
  // not separated by whitespaces, it will be evaluated as a string
  // concatenation. As a result, the preceding and interpolated values will be
  // concatenated into a single string.

  const colors = {
    dark: {
      fg: "white",
    },
    light: {
      fg: "black",
    },
  };

  cx`text-${colors.light.fg} dark:text-${colors.dark.fg}` // "text-black dark:text-white"
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Using interpolations for dynamic class-names
    </strong>
  </summary>

  ```js
  // When a string value is used as an interpolation where the placeholder is
  // separated by whitespaces, it will be evaluated as a separate class-name.

  const flexDirection = "column"; // "" | "column" | "row"

  cx`flex ${flexDirection}` // "flex column"
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Using string interpolations as conditional expressions
    </strong>
  </summary>

  ```js
  // When a string value is used as an interpolation where the placeholder is
  // separated by whitespaces, it will be evaluated as a separate class-name.
  // However, the `test` operator can be used to remove the preceding values
  // based on the last value's truthiness.
  //
  // The `test` operator removes the preceding values only if the last value is
  // falsy. Otherwise, unless it is a non-empty string, the operator removes
  // only the last value from the stack.

  const flexDirection = ""; // "" | "column" | "row"

  cx`
  nice
  flex ${flexDirection} ${cx.op.test} box
  ` // "nice box"
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Emitting values in the stack to the renderer
    </strong>
  </summary>

  ```js
  // The `emit` operator can be used to emit the values in the stack to the
  // renderer and clear the stack for the next operations, explicitly. It is
  // automatically inserted by the parser when a line feed or template feed
  // (end of template) is detected.

  const flexDirection = "column"; // "" | "column" | "row"

  cx`
  nice
  flex ${flexDirection} ${cx.op.emit} box
  ` // "nice flex column box"
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Discarding values from the stack
    </strong>
  </summary>

  ```js
  // The `discard` operator can be used to clear the stack. It can be used for
  // comments or debugging purposes.
  //
  // Since the line-feeds are considered as implicit emit operators, the
  // `discard` operator can only be used for the values placed in the same
  // line.
  //
  // However, the information of which values are discarded can be adjusted by
  // the developer by using an explicit `emit` operator just after the
  // class-names that are intended to be emitted.

  const flexDirection = "column"; // "" | "column" | "row"

  cx`
  nice
  flex ${flexDirection} ${cx.op.emit} Comment out. ${cx.op.discard} box
  Your lovely important note. ${cx.op.discard}
  ` // "nice flex column box"
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Deduplicating class-names
    </strong>
  </summary>

  ```js
  // The class-names emitted to the renderer are deduplicated by default. This
  // behavior ensures that the same class-name is not repeated in the final
  // output.

  cx`foo foo bar`; // "foo bar"
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Transforming class-names with CSS Modules
    </strong>
  </summary>

  ```js
  // Any transformation can be applied to the class-names by defining a custom
  // transformer function.
  //
  // If the transformer returns an empty string, the class-name will be
  // discarded.
  //
  // For utilizing CSS Modules, the built-in extension can be used to create a
  // transformer that maps class-names to their respective values, which are
  // imported from the CSS module file.
  //
  // When CSS Modules transformation is used with the `cx` tag, it is
  // recommended to name it as `cmx` to avoid conflicts with the unbound `cx`
  // tag.

  import styles from "./styles.module.css";

  cmx`foo bar`; // "bar" (assuming styles.foo = "bar")
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Defining custom operators
    </strong>
  </summary>

  ```js
  // Custom operators can be defined by using the `defineOperator` function.
  // The operator function should accept the stack and emit function as
  // arguments.
  //
  // This example demonstrates defining a custom operator named `prefix` that
  // prefixes the class-names placed before the last value using the last
  // value.

  cx.op.prefix = defineOperator({
    name: "prefix",
    operate(
      stack,
      emit,
    )
    {
      // Get the last value from the stack by removing it.
      const prefix = stack.values.pop();

      // Keep the CX runtime error-free.
      if (typeof prefix === "string")
      {
        for (let i = 0; i < stack.values.length; i++)
        {
          const value = stack.values[i];

          // Only string values can be prefixed.
          if (typeof value === "string")
          {
            stack.values[i] = `${prefix}${value}`;
          }
        }
      }
    },
  });

  cx`foo bar the- ${cx.op.prefix}` // the-foo the-bar
  ```
</details>

<details>
  <summary>
    <strong>
      Example: Using with JSX components
    </strong>
  </summary>

  ```jsx
  // Since the line-feeds are considered as emit operators,
  // every line is a new group of class-names that is isolated from the
  // operators placed in the other lines.
  //
  // In CX, I recommend you to not hesitate to press <Enter> often. Because
  // without it, there is a lot of `===`, `?`, `:`, `.`, `,`, `true`,
  // `[`, `]`, `{`, `}`, `(`, `)`, `'`. `"` ...

  const Button = (props) =>
  {
    const {
      bordered = false,
      className,
      color = "primary",
      dense = false,
      disabled = false,
      ...rest
    } = props;

    return (
      <div
        className={cmx`
          button
          button--${color}
          px-4 py-1.5 ${!dense}
          border
          ${bordered ? "border-gray-300 dark:border-gray-700" : "border-transparent"}
          opacity-50 cursor-not-allowed ${disabled}
          Append custom class-names passed from the parent component: {$cx.op.discard}
          ${className}
        `}
        {...rest}
      />
    );
  };
  ```
</details>

## Motivation

The language is designed to be simple and easy to use, with a minimal syntax
that is both readable and writable. It is intended to be used in conjunction
with tagged template literals in JavaScript, allowing developers to create
class-name expressions that are both dynamic and composable.

Before diving into the implementation details, it is worth mentioning that;
for ensuring the compatibility and correctness of the implementation with the
real-world class-names, the implementation has been thoroughly tested with over
**21400** scenarios using a small dataset of class-names composed with
different syntaxes and patterns. The dataset is built by extracting various
class-names from the documentation of one of the most popular CSS frameworks,
`Tailwind CSS`.

## Syntax and Semantics

To understand the syntax and semantics of CX, let's continue with the initial
implementation of the language, `cx-tagged-template`. As it is published as a
package on `npm`, it is possible to install it and start using it in your
projects. However, it can also be used as a reference implementation for
integrating CX into other languages.

The implementation of `cx-tagged-template` is composed of several key
components, each responsible for a specific aspect of the class-name-expression
construction process. In the following sections, we will explore each of these
components in detail, starting with the consolidator layer, which is
responsible for transforming tagged-template specific data into a more
generalized format.

### Consolidator

The consolidator is tasked with combining template strings and expressions into
a unified stream of fragments, ensuring the correct order and type of
fragments.

For example, given the following template:

```js
cx`nice ${false} nice--better ${true}`;
```

The consolidator emits the following fragments to the parser:

```js
{ index: 0, type: 'template-string', value: 'nice ' }
{ index: 0, type: 'template-expression', value: false }
{ index: 1, type: 'template-string', value: ' nice--better ' }
{ index: 1, type: 'template-expression', value: true }
{ index: 3, type: 'template-feed', value: '' }
```

### Tokenizer

The tokenizer parses template-string fragments into tokens, which represent the
smallest units of the language.

As the fragments are received by the parser, parser may use the tokenizer to
convert string fragments into tokens. For the given fragments above, the
tokenizer emits the following tokens back to the parser:

```js
{ index: 0, type: 'character', value: 'n' }
{ index: 1, type: 'character', value: 'i' }
{ index: 2, type: 'character', value: 'c' }
{ index: 3, type: 'character', value: 'e' }
{ index: 4, type: 'whitespace', value: ' ' }
{ index: 5, type: 'eof', value: '' }
{ index: 0, type: 'whitespace', value: ' ' }
{ index: 1, type: 'character', value: 'n' }
{ index: 2, type: 'character', value: 'i' }
{ index: 3, type: 'character', value: 'c' }
{ index: 4, type: 'character', value: 'e' }
{ index: 5, type: 'character', value: '-' }
{ index: 6, type: 'character', value: '-' }
{ index: 7, type: 'character', value: 'b' }
{ index: 8, type: 'character', value: 'e' }
{ index: 9, type: 'character', value: 't' }
{ index: 10, type: 'character', value: 't' }
{ index: 11, type: 'character', value: 'e' }
{ index: 12, type: 'character', value: 'r' }
{ index: 13, type: 'whitespace', value: ' ' }
{ index: 14, type: 'eof', value: '' }
```

### Parser

The parser performs both syntactic and semantic analysis of the fragments and
tokens. It evaluates string interpolations and inserts implicit operators as
necessary.

Continuing the examples in the previous sections, the parser emits the
following values and operators to the interpreter:

```js
nice
false
[Function: operate] { [Symbol(__cx_operator__)]: { name: 'test' } }
nice--better
true
[Function: operate] { [Symbol(__cx_operator__)]: { name: 'test' } }
[Function: operate] { [Symbol(__cx_operator__)]: { name: 'emit' } }
```

### Stack

The stack serves as the storage layer for the interpreter, buffering
class-names and other values between the interpreter and the renderer.

### Operators

Operators are functions that modify the stack based on their specific behavior.
Built-in operators handle tasks such as emitting class-names to the renderer or
removing values from the stack, e.g.: conditional removal, etc.

To be compatible with the CSS selector syntax, all the punctuation characters
are allowed in the string fragments. Because of this, the language should not
have any operators that can be used outside of interpolation placeholders
(expression fragments). Besides the compatibility, this design choice also
helps reducing the cognitive load by making the language more predictable and
easier to use.

For example, in the following snippet, the `discard` operator can be seen as an
interpolation, which is specified inside a placeholder.

```js
cx`nice nice--better ${true} ${cx.op.discard} nice--best`; // "nice--best"
```

#### Built-in Operators

Respecting the minimalist nature of the language, the following built-in
operators are provided:

- [`emit`](./src/operators/emit.ts): Emits the string values in the stack to
  the renderer, then clears the stack for the next operations.
- [`test`](./src/operators/test.ts): Works as a conditional operator, removing
  values from the stack based on the last value.
- [`discard`](./src/operators/discard.ts): Clears the stack. It can be used for
  comments or debugging purposes.

#### Implicit Operators

Implicit operators are automatically inserted by the parser to handle
predefined behaviors. For example, the `test` operator is inserted when a
conditional expression (non-string and non-operator value) is detected. And the
`emit` operator is inserted when a line feed or template feed (end of template)
is detected.

### Interpreter

The interpreter manages the stack, pushing values onto it and executing
operators as required.

Back on the example in the parser section, as the parser emits the values and
operators, the interpreter processes them, updating the stack accordingly. Each
line in this demonstration represents the state of the stack after a value or
operator is processed:

```js
Stack: []
Stack: ["nice"]
Stack: ["nice", false]
Operation: test
Stack: []
Stack: ["nice--better"]
Stack: ["nice--better", true]
Operation: test,
Stack: ["nice--better"]
Operation: emit,
Stack: []
```

### Transformer

As an extension point, transformers allow developers to customize the final
output of the class-names by defining their own transformation functions. The
transformer layer can be used to apply transformations such as
[CSS Modules](https://github.com/css-modules/css-modules), adding prefixes or
suffixes, or even removing class-names based on certain conditions by returning
an empty string.

### Renderer

The renderer aggregates and deduplicates class-names, applying any specified
transformation. It concatenates the class-names into a single string, which
is returned to the template tag.

Once a class-name is emitted to the renderer; unless it is transformed to an
empty string by a user-defined transformer, it is guaranteed to be uniquely
present in the final output.

### Template Tag

The template tag serves as the public interface, allowing developers to create
class-name expressions. It orchestrates the flow of data through the various
components, ultimately returning the final result.

## Installation

The library `cx-tagged-template` is available on `npm` and can be installed
using a compatible package manager:

```sh
npm install cx-tagged-template
# or
yarn add cx-tagged-template
```

**Note:** The library is compiled into both CJS and ESM formats. It supports
[tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking),
and when bundled with a compatible bundler, the code size can be reduced to
approximately 2.17 KB (minified and gzipped).

## Usage

To start using the `cx` template tag, you can import it from the package:

```js
import { cx } from 'cx-tagged-template';

const className = cx`nice nice--better ${0} nice--best`; // "nice--best"
```

### CSS Modules Integration

For projects utilizing CSS Modules, the built-in extension can be used to
create a transformer that maps class-names to their respective values, which
are imported from the CSS module file. Then, a custom `cx` tag can be created
using the transformer:

```js
import { createCX } from "cx-tagged-template";
import { createCSSModulesTransformer } from "cx-tagged-template/extensions/css-modules";

import styles from "./styles.module.css";

const cmx = createCX({
  transformer: createCSSModulesTransformer(styles),
});

const className = cmx`foo bar`; // "bar" (assuming styles.foo = "bar")
```

## References

- [Concatenative programming language - Wikipedia](https://en.wikipedia.org/wiki/Concatenative_programming_language)
- [Tagged templates - JavaScript - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

## License

This project is licensed under the
[MIT License](https://opensource.org/license/mit).
For more information, see the [LICENSE](./LICENSE) file.
