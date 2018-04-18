export default {
  input: 'src/index.js',
  external: ['testdouble', 'testdouble/lib/store/stubbings'],
  output: {
    format: 'cjs',
    file: 'dist/bundle.js'
  }
}
