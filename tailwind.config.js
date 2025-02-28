/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        'priority-1': '#FF4D4F', // Urgent & Important - Red
        'priority-2': '#1890FF', // Important but Not Urgent - Blue
        'priority-3': '#FFA940', // Urgent but Not Important - Orange
        'priority-4': '#52C41A', // Neither Urgent nor Important - Green
      }
    },
  },
  plugins: [],
} 