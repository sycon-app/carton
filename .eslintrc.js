/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["sznm/react", "plugin:react/jsx-runtime"],
    rules: {
        indent: ["error", 4],
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
            },
        ],
    },
};
