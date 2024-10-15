import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts'],
    ignores: ['dist'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.jest
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      'no-console': 'warn',
    },
  },
  eslintConfigPrettier,
);
