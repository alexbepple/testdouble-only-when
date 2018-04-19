import {
  assertThat,
  is,
  not,
  throws,
  typedError,
  instanceOf,
  containsString,
  allOf,
  promiseThat,
  willBe,
  containsInAnyOrder
} from 'hamjest'
import td from 'testdouble'
import { onlyWhen, failOnOtherCalls } from './index'

beforeEach(td.reset)

describe('Problem', () => {
  it('unrehearsed usage fails late because of the consequences of default stub behavior', () => {
    const stub = td.function()
    td.when(stub(0)).thenReturn('foo')

    const fut = (collaborator) => collaborator().substring(1)

    assertThat(
      () => assertThat(fut(stub), is('oo')),
      throws(
        typedError(TypeError, "Cannot read property 'substring' of undefined")
      )
    )
  })
})

const errorOnUnrehearsedUsage = typedError(
  Error,
  allOf(containsString('stubbing'), containsString('invocation'))
)

describe('Strict stub with one stubbing: onlyWhen(stub(…))', () => {
  it('supports same stubbing behaviors as td.when(…)', () => {
    const stub = td.function()
    assertThat(
      Object.getOwnPropertyNames(onlyWhen(stub())),
      containsInAnyOrder(...Object.getOwnPropertyNames(td.when(stub())))
    )
  })

  describe('.thenReturn(…)', () => {
    const stub = td.function()
    beforeEach(() => onlyWhen(stub(0)).thenReturn(1))

    it('fails early on unrehearsed usage and explains what happened', () => {
      assertThat(() => stub(), throws(errorOnUnrehearsedUsage))
    })
    it('succeeds on rehearsed usage', () => {
      assertThat(stub(0), is(1))
    })
  })

  describe('.thenResolve(…)', () => {
    const stub = td.function()
    beforeEach(() => onlyWhen(stub(0)).thenResolve(1))

    it('fails early on unrehearsed usage', () => {
      assertThat(() => stub(), throws())
    })
    it('succeeds on rehearsed usage', () => {
      return promiseThat(stub(0), willBe(1))
    })
  })

  describe('.thenThrow(…)', () => {
    describe('.thenThrow(stub(0))', () => {
      const stub = td.function()
      beforeEach(() => onlyWhen(stub(0)).thenThrow(new Error('foo')))

      it('fails on unrehearsed usage', () => {
        assertThat(() => stub(), throws(errorOnUnrehearsedUsage))
      })
      it('succeeds on rehearsed usage', () => {
        assertThat(() => stub(0), throws(typedError(Error, 'foo')))
      })
    })

    describe('.thenThrow(stub())', () => {
      const stub = td.function()
      beforeEach(() => onlyWhen(stub()).thenThrow(new Error('foo')))

      it('fails on unrehearsed usage', () => {
        assertThat(() => stub(0), throws(errorOnUnrehearsedUsage))
      })
      it('succeeds on rehearsed usage', () => {
        assertThat(() => stub(), throws(typedError(Error, 'foo')))
      })
    })
  })

  describe('.thenCallback(…)', () => {
    const stub = td.function()
    beforeEach(() => onlyWhen(stub()).thenCallback('err', 'data'))

    it('fails on unrehearsed usage', () => {
      assertThat(() => stub(0), throws())
    })
    it('succeeds on rehearsed usage', () => {
      const cb = td.function()
      stub(cb)
      td.verify(cb('err', 'data'))
    })
  })

  describe('.thenReturn(…) and all other behaviors', () => {
    it('return the stub itself for one-line stubbings', () => {
      const stub = onlyWhen(td.function()(0)).thenReturn(1)
      stub(0)
    })
    it('can return 0', () => {
      const stub = onlyWhen(td.function()()).thenReturn(0)
      assertThat(stub(), is(0))
    })
    it("can return 'undefined'", () => {
      const stub = onlyWhen(td.function()()).thenReturn(undefined)
      assertThat(stub(), is(undefined))
    })
    describe('pass options to testdouble.js', () => {
      it('ignoreExtraArgs', () => {
        const stub = td.function()
        onlyWhen(stub(0), { ignoreExtraArgs: true }).thenReturn(1)
        assertThat(stub(0, 0), is(1))
        assertThat(() => stub(1, 0), throws())
      })
      it('times', () => {
        const stub = onlyWhen(td.function()(), { times: 2 }).thenReturn(0)
        assertThat(stub(), is(0))
        assertThat(stub(), is(0))
        assertThat(() => stub(), throws())
      })
    })
    it('allow for matchers', () => {
      const stub = td.function()
      onlyWhen(stub(td.matchers.argThat((x) => x < 2))).thenReturn(0)
      assertThat(stub(1), is(0))
      assertThat(() => stub(2), throws())
    })
    it('allow multiple stubbed values', () => {
      const stub = onlyWhen(td.function()()).thenReturn(0, 1)
      assertThat(stub(), is(0))
      assertThat(stub(), is(1))
    })
  })
})

describe('Strict stub with multiple stubbings', () => {
  const stub = td.function()
  beforeEach(() => {
    td.when(stub(0)).thenReturn(1)
    td.when(stub(1)).thenReturn(2)
    failOnOtherCalls(stub)
  })
  it('succeeds on all rehearsed usages', () => {
    assertThat(stub(0), is(1))
    assertThat(stub(1), is(2))
  })
  it('fails early on unrehearsed usage', () => {
    assertThat(() => stub(), throws())
  })
})
