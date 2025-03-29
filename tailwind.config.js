/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Root app directory
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Include src directory
    // "./components/**/*.{js,ts,jsx,tsx,mdx}", // No longer needed at root
    "./content/**/*.mdx", // Include content directory for MDX files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif'], // Updated to Source Serif Pro
      },
      // Add other theme extensions if needed later
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
