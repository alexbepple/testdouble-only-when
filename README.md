[![npm version](https://img.shields.io/npm/v/testdouble-only-when.svg)](https://www.npmjs.com/package/testdouble-only-when)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# testdouble-only-when

Rehearse strict behavior with [testdouble.js](https://github.com/testdouble/testdouble.js).  
Almost a drop-in replacement for `td.when`.


## Usage

Install (_testdouble_ is a peer dependency):

```
$ yarn install --dev testdouble testdouble-only-when
```

Import:

```javascript
import td from 'testdouble'
import { onlyWhen } from 'testdouble-only-when'
```

Use:

```javascript
const stub = td.function()
onlyWhen(stub(0)).thenReturn(true)

stub(0)  // => true
stub()   
// => Error:
// ​​You invoked a test double in an unexpected fashion.​​
// ​​​​This test double has 1 stubbings and 2 invocations.​​
​​​​
// ​​​​Stubbings:​​
// ​​​​  - when called with `(0)`, then return `true`.​​
​​​​
// ​​​​Invocations:​​
// ​​​​  - called with `(0)`.​​
// ​​​​  - called with `()`.​​
```

## Features

`onlyWhen` is almost a drop-in replacement for `td.when`. To my knowledge, the only exception are [multiple stubbings](#multiple-stubbings).

* All stubbing behaviors are supported: `thenReturn`, `thenThrow`, `thenResolve`, `thenReject`, `thenDo`, `thenCallback`.
* Options, e.g. `ignoreExtraArgs`
* One-liner stubbings: `onlyWhen(td.func()(0)).thenReturn(true)`
* Argument matchers: `onlyWhen(td.func()(td.matchers.anything())).thenReturn(true)`
* Sequential return values: `onlyWhen(td.func()(0)).thenReturn(true, false)`


### Options

You can pass options like with `td.when`:

```javascript
const stub = td.function()
onlyWhen(stub(0), { ignoreExtraArgs: true }).thenReturn(true)

stub(0, 0)  // => true
stub(0, 1)  // => true
stub(1)     // => Error
```

### Multiple stubbings

```javascript
td.when(stub(0)).thenReturn(true)
td.when(stub(1)).thenReturn(false)
failOnOtherCalls(stub)
```
