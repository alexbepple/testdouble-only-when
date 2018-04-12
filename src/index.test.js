import { assertThat, is, not, throws, typedError, instanceOf, containsString, allOf, promiseThat, willBe } from 'hamjest'
import td from 'testdouble'
import { onlyWhen } from './index'

beforeEach(td.reset)

describe('Problem', () => {
  it('unrehearsed usage fails late because of the consequences of default stub behavior', () => {
    const stub = td.function()
    td.when(stub(0)).thenReturn('foo')

    const fut = (collaborator) => collaborator().substring(1)

    assertThat(
      () => assertThat(fut(stub), is('oo')),
      throws(typedError(TypeError, "Cannot read property 'substring' of undefined")))
  })
})

describe('Solution with legacy API (onlyWhen(stub).calledWith(…).thenReturn(…))', () => {
  let stub
  beforeEach(() => {
    stub = td.function()
    onlyWhen(stub).calledWith(0).thenReturn(1)
  })

  it('fails early on unrehearsed usage', () => {
    assertThat(() => stub(), throws(not(instanceOf(TypeError))))
  })
  it('succeeds on rehearsed usage', () => {
    assertThat(stub(0), is(1))
  })
})

describe('Solution with new API: onlyWhen(stub(…))', () => {
  describe('.thenReturn(…)', () => {
    const stub = td.function()
    beforeEach(() => onlyWhen(stub(0)).thenReturn(1))

    it('fails early on unrehearsed usage and explains what happened', () => {
      assertThat(() => stub(), throws(typedError(Error,
        allOf(containsString('stubbing'), containsString('invocation'))
      )))
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
})
