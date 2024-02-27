import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				tundura: {
					DEFAULT: "#4A4A4A",
					50: "#A6A6A6",
					100: "#9C9C9C",
					200: "#878787",
					300: "#737373",
					400: "#5E5E5E",
					500: "#4A4A4A",
					600: "#2E2E2E",
					700: "#121212",
					800: "#000000",
					900: "#000000",
					950: "#000000",
				},
			},
		},
	},
	plugins: [],
};
