import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...pluginQuery.configs['flat/recommended'],
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    name: 'prettier/setup',
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  {
    name: 'prettier/config',
    rules: configPrettier.rules,
  },
];

export default eslintConfig;
