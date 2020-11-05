module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: [
    'prettier',
    'babel',
    'import',
    'jsx-a11y',
    'react',
    'react-hooks',
    'jest-dom',
  ],
  ignorePatterns: ['node_modules', 'assets'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:jest-dom/recommended',
    'prettier/react',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  globals: {
    // any global variables go here
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'off',
    'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
