module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:react/recommended",
		"./.eslintrc-auto-import.json",
	],
	rules: {
		"prettier/prettier": ["error", { usePrettierrc: true }],
		"no-param-reassign": "off",
		camelcase: [1, { properties: "never" }],
		"no-console": 2,
		"@typescript-eslint/no-explicit-any": 0,
		"react/react-in-jsx-scope": 0,
		"react/prop-types": 0,
	},
};
