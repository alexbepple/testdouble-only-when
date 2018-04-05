export default {
  input: 'src/index.js',
  external: ['testdouble'],
  output: {
    format: 'cjs',
    file: 'dist/bundle.js'
  }
}
