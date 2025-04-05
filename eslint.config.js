import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },
        plugins: { js },
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        },
        extends: ["js/recommended", "prettier"]
    },
    {
        files: ["**/__tests__/**/*.test.{js,mjs,cjs}"],
        plugins: {
            vitest
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals
            }
        },
        rules: {
            ...vitest.configs.recommended.rules
        }
    },
    eslintConfigPrettier
]);
