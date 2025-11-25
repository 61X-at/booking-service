module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "prettier"
    ],
    settings: {
        react: { version: "detect" }
    },
    env: {
        browser: true,
        es2021: true
    }
};
