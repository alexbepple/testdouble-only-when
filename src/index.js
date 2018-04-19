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

const symbolForUndefined = Symbol('for undefined')
const wrapIfUndefined = (x) => (x === undefined ? symbolForUndefined : x)
const unwrapIfUndefined = (x) => (x === symbolForUndefined ? undefined : x)

export const failOnOtherCalls = (stub) => {
  const shadowStub = td.function()
  stubbings.for(stub).forEach((stubbing) => {
    const { args, config, stubbedValues } = stubbing
    const effectiveStubbedValues = stubbedValues.map(wrapIfUndefined)
    td.when(shadowStub(...args), config)[config.plan](...effectiveStubbedValues)
  })
  td.when(stub(), { ignoreExtraArgs: true }).thenDo((...args) => {
    const fromShadow = shadowStub(...args)
    if (typeof fromShadow != 'undefined') return unwrapIfUndefined(fromShadow)
    throw new Error(
      'You invoked a test double in an unexpected fashion.\n' +
        td.explain(shadowStub).description
    )
  })
}

const stubStrictly = (behaviorName, options) => (...returnValues) => {
  const stub = td.when(undefined, options)[behaviorName](...returnValues)
  failOnOtherCalls(stub)
  return stub
}

export const onlyWhen = (stubOrReturnValue, options) => {
  if (td.explain(stubOrReturnValue).isTestDouble)
    return onlyWhenWithDouble(stubOrReturnValue)

  return {
    thenReturn: stubStrictly('thenReturn', options),
    thenResolve: stubStrictly('thenResolve', options),
    thenDo: stubStrictly('thenDo', options),
    thenReject: stubStrictly('thenReject', options)
  }
}
