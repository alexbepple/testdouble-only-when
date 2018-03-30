import { assertThat, is, throws, typedError } from 'hamjest'
import td from 'testdouble'

describe('Problem: this fails, but is hard to debug', () => {
  it('fails not because of the wrong invocation, but because of the consequences of default stub behavior', () => {
    const stub = td.function()
    td.when(stub(0)).thenReturn('foo')

    const fut = (collaborator) => collaborator().substring(1)

    assertThat(() => fut(stub), throws(typedError(TypeError, "Cannot read property 'substring' of undefined")))
  })
})
