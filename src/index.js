import td from 'testdouble'
import stubbings from 'testdouble/lib/store/stubbings'

const countCallsToStubbings = (stub) =>
  stubbings
    .for(stub)
    .map((x) => x.callCount)
    .reduce((a, b) => a + b, 0)

export const failOnOtherCalls = (stub) => {
  const shadowStub = td.function()
  stubbings.for(stub).forEach((stubbing) => {
    const { args, config, stubbedValues } = stubbing
    td.when(shadowStub(...args), config)[config.plan](...stubbedValues)
  })
  try {
    // try-catch this for stubs that throw immediately
    stub()
  } catch (e) {}
  td.when(undefined, { ignoreExtraArgs: true }).thenDo((...args) => {
    const callsBefore = countCallsToStubbings(shadowStub)
    const fromShadow = shadowStub(...args)
    const callsAfter = countCallsToStubbings(shadowStub)
    if (callsAfter > callsBefore) return fromShadow
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

const stubbingBehaviors = [
  'thenReturn',
  'thenThrow',
  'thenResolve',
  'thenDo',
  'thenReject',
  'thenCallback'
]

export const onlyWhen = (__returnValueOfCallToStub, options) => {
  const addBehavior = (result, behavior) => {
    result[behavior] = stubStrictly(behavior, options)
    return result
  }
  return stubbingBehaviors.reduce(addBehavior, {})
}
