[![npm version](https://img.shields.io/npm/v/testdouble-only-when.svg)](https://www.npmjs.com/package/testdouble-only-when)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# testdouble-only-when
Rehearse strict behavior with [testdouble.js](https://github.com/testdouble/testdouble.js)


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

### Supported stubbing facilities

* `thenReturn`
* `thenResolve`


### Multiple stubbings

```javascript
td.when(stub(0)).thenReturn(true)
td.when(stub(1)).thenReturn(false)
failOnOtherCalls(stub)
```


## Backlog

- [x] ~PoC with verbose API (`onlyWhen(stub).calledWith(0).thenReturn(true)`)~
- [x] ~PoC with magic _testdouble_-like API (`onlyWhen(stub(0)).thenReturn`)~
- [x] ~improve error message and/or debugging facilities~
- [x] ~thenResolve~
- [x] ~multiple stubbings~
- [ ] thenThrows etc.
- [ ] return stub for one-liners
