import { assertThat, is, not, throws, typedError, instanceOf } from 'hamjest'
import td from 'testdouble'

describe('Problem: this fails, but is hard to debug', () => {
  it('fails not because of the wrong invocation, but because of the consequences of default stub behavior', () => {
    const stub = td.function()
    td.when(stub(0)).thenReturn('foo')

    const fut = (collaborator) => collaborator().substring(1)

    assertThat(() => fut(stub), throws(typedError(TypeError, "Cannot read property 'substring' of undefined")))
  })
})

const onlyWhen = (double) => {
  const shadowDouble = td.function()
  return {
    calledWith: (...expectedParams) => ({
      thenReturn: (...returnValues) => {
        td.when(shadowDouble(...expectedParams)).thenReturn(...returnValues)
        td.when(double(), { ignoreExtraArgs: true }).thenDo((...actualParams) => {
          const fromShadow = shadowDouble(...actualParams)
          if (fromShadow) return fromShadow
          throw new Error('You invoked a test double in an unexpected fashion.')
        })
      }
    })
  }
}

describe('Solution', () => {
  const stub = td.function()

  before(() => onlyWhen(stub).calledWith(0).thenReturn(1))

  it('fail early on unrehearsed invocation', () => {
    assertThat(() => stub(), throws(not(instanceOf(TypeError))))
  })
  it('succeed on rehearsed invocation', () => {
    assertThat(stub(0), is(1))
  })
})
