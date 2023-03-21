// TODO: figure out why import/no-unresolved doesn't work on windows...
module.exports = {
  extends: ['kentcdodds', 'kentcdodds/jest'],
  rules: {
    'no-console': 'off',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'require-await': 'warn',
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: ['**/tests/**'],
      settings: {
        'import/resolver': {
          jest: {
            jestConfigFile: require.resolve('./jest.config.js'),
          },
        },
      },
    }
  ],
}
