import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

// Flat config (ESLint 9+). Two file groups share the same core JS/React
// rules; the test group additionally gets the Vitest globals that
// `vitest.config` exposes via `test: { globals: true }`, so spec files
// don't need to import describe/it/expect explicitly.
const reactRules = {
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  'react/jsx-key': 'error',
  'react/no-unescaped-entities': 'error',
  'react/prop-types': 'off', // plain JS components, no PropTypes/TS in this codebase
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
}

const corePlugins = { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh }

export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    plugins: corePlugins,
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactRules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    plugins: corePlugins,
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactRules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
