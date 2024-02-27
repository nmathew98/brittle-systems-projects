module.exports = {
	env: { browser: true, es2020: true },
	plugins: ["@typescript-eslint", "prettier", "react-refresh"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:react/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: { ecmaVersion: "latest", sourceType: "module" },
	rules: {
		"prettier/prettier": ["error", { usePrettierrc: true }],
		"no-param-reassign": "off",
		camelcase: [1, { properties: "never" }],
		"no-console": 2,
		"@typescript-eslint/no-explicit-any": 0,
		"react/react-in-jsx-scope": 0,
		"react/prop-types": 0,
		"react-refresh/only-export-components": "warn",
	},
};
