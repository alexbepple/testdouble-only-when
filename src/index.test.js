import { assertThat, is, not, throws, typedError, instanceOf } from 'hamjest'
import td from 'testdouble'
import { onlyWhen } from './index'

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

describe('Solution', () => {
  describe('with legacy API (onlyWhen(stub).calledWith(…).thenReturn(…))', () => {
    const stub = td.function()
    before(() => onlyWhen(stub).calledWith(0).thenReturn(1))

    it('fails early on unrehearsed usage', () => {
      assertThat(() => stub(), throws(not(instanceOf(TypeError))))
    })
    it('succeeds on rehearsed usage', () => {
      assertThat(stub(0), is(1))
    })
  })

  describe('with new API (onlyWhen(stub(…)).thenReturn(…))', () => {
    const stub = td.function()
    before(() => onlyWhen(stub(0)).thenReturn(1))

    it('fails early on unrehearsed usage', () => {
      assertThat(() => stub(), throws(not(instanceOf(TypeError))))
    })
    it('succeeds on rehearsed usage', () => {
      assertThat(stub(0), is(1))
    })
  })
})
