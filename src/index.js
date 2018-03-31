import td from 'testdouble'

export const onlyWhen = (double) => {
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
