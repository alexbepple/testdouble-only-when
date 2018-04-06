[![npm version](https://img.shields.io/npm/v/testdouble-only-when.svg)](https://www.npmjs.com/package/testdouble-only-when)

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
stub()   // => Error('You invoked a test double in an unexpected fashion.​​')
```


## Backlog

- [x] ~PoC with verbose API (`onlyWhen(stub).calledWith(0).thenReturn(true)`)~
- [x] ~PoC with magic _testdouble_-like API (`onlyWhen(stub(0)).thenReturn`)~
- [x] ~improve error message and/or debugging facilities~
- [x] ~thenResolve~
- [ ] :question: Do we need to support multiple calls?
- [ ] thenThrows etc.
- [ ] return stub for one-liners
