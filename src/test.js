import { assertThat, is } from 'hamjest'
import td from 'testdouble'

const fut = (collaborator) => collaborator().substring(1)

describe('Demonstrate problem', () => {
  it('this fails, but is hard to debug', () => {
    const stub = td.function()
    td.when(stub(0)).thenReturn('foo')
    assertThat(fut(stub), is('oo'))
  })
})
