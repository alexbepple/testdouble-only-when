import td from 'testdouble'
import stubbings from 'testdouble/lib/store/stubbings'

const onlyWhenWithDouble = (double) => {
  const shadowDouble = td.function()
  return {
    calledWith: (...expectedParams) => ({
      thenReturn: (...returnValues) => {
        td.when(shadowDouble(...expectedParams)).thenReturn(...returnValues)
        td
          .when(double(), { ignoreExtraArgs: true })
          .thenDo((...actualParams) => {
            const fromShadow = shadowDouble(...actualParams)
            if (fromShadow) return fromShadow
            throw new Error(
              'You invoked a test double in an unexpected fashion.'
            )
          })
      }
    })
  }
}

export const failOnOtherCalls = (stub) => {
  const shadowStub = td.function()
  stubbings.for(stub).forEach((stubbing) => {
    const { args, config, stubbedValues } = stubbing
    td.when(shadowStub(...args))[config.plan](...stubbedValues)
  })
  td.when(stub(), { ignoreExtraArgs: true }).thenDo((...args) => {
    const fromShadow = shadowStub(...args)
    if (fromShadow) return fromShadow
    throw new Error(
      'You invoked a test double in an unexpected fashion.\n' +
        td.explain(shadowStub).description
    )
  })
}

const stubStrictly = (behaviorName) => (...returnValues) => {
  const stub = td.when()[behaviorName](...returnValues)
  failOnOtherCalls(stub)
  return stub
}

export const onlyWhen = (stubOrReturnValue) => {
  if (td.explain(stubOrReturnValue).isTestDouble)
    return onlyWhenWithDouble(stubOrReturnValue)

  return {
    thenReturn: stubStrictly('thenReturn'),
    thenResolve: stubStrictly('thenResolve')
  }
}
