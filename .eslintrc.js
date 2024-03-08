module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true,
                "browser": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        // code style
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "indent": ["error", 4],
        "no-unused-vars": ["warn", { "argsIgnorePattern": "next" }],
        "camelcase": "error",
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "comma-dangle": ["error", "never"],
        "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
        "func-style": ["error", "declaration", { "allowArrowFunctions": true }],

        // code quality
        "curly": ["error", "all"],
        "eqeqeq": "error",
        "no-multi-spaces": "error",
        "no-unreachable": "error",
        "prefer-const": "error",
        "no-var": "error",
        "no-unsafe-finally": "error",
        "no-duplicate-imports": "error",
        "no-else-return": "error"
    }
};
