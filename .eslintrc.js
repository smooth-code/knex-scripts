module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
}
