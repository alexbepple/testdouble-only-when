import td from 'testdouble'
import stubbings from 'testdouble/lib/store/stubbings'

const onlyWhenWithDouble = (double) => {
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

export const onlyWhen = (stubOrReturnValue) => {
  if (td.explain(stubOrReturnValue).isTestDouble)
    return onlyWhenWithDouble(stubOrReturnValue)

  const shadowStub = td.function()
  return {
    thenReturn: (...returnValues) => {
      const stub = td.when().thenReturn(...returnValues)
      const expectedParams = stubbings.for(stub)[0].args

      td.when(shadowStub(...expectedParams)).thenReturn(...returnValues)
      td.when(stub(), { ignoreExtraArgs: true }).thenDo((...actualParams) => {
        const fromShadow = shadowStub(...actualParams)
        if (fromShadow) return fromShadow
        throw new Error('You invoked a test double in an unexpected fashion.\n' + td.explain(shadowStub).description)
      })
    }
  }
}
