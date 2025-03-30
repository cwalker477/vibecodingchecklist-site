const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Root app directory
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Include src directory (contains components)
    // "./components/**/*.{js,ts,jsx,tsx,mdx}", // No longer needed at root
    "./content/**/*.{md,mdx}", // Include content directory for MDX and MD files
  ],
  theme: {
    fontFamily: { // Move fontFamily directly under theme
      sans: ['Inter', 'sans-serif'],
      serif: ['Source Serif Pro', 'serif'],
    },
    extend: { // Use extend for colors to merge with defaults
      colors: {
        ...defaultTheme.colors, // Spread ALL default colors within extend
        'dark-bg': '#121212',      // Very dark gray background
        'dark-text': '#e0e0e0',    // Light gray body text
        'dark-heading': '#ffffff', // White for headings
        'dark-muted': '#a0a0a0',   // Muted text (adjust from gray-500)
        'dark-accent': '#4ea8de',  // Accent blue
        'dark-card': '#1e1e1e',    // Slightly lighter card background (adjust from zinc-900 if needed)
        'dark-border': '#333333',  // Soft border color
        // Custom dark colors will overwrite defaults if names clash
      },
      // Keep extend INSIDE theme
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
    }, // Close extend
  }, // Close theme
  plugins: [
    require('@tailwindcss/typography'), // Re-add typography plugin
  ],
};
