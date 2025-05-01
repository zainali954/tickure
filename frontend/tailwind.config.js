/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'cat-1': '#A47E42',
        'cat-2': '#9B7EBD',
        'cat-3': '#009688',
        'cat-4': '#795548',
        'cat-5': '#ADA397',
        'cat-6': '#D2797F',
        'cat-7': '#8BC34A',
        'cat-8': '#BD5734',
        'cat-9': '#C08552',
        'cat-10': '#9E9E1C',
        'cat-11': '#FFAB91',
        'cat-12': '#607D8B',
      },
    },
  },
  safelist: [
    "bg-yellow-500",
    "bg-gree-500",
    "bg-red-500",
    "bg-gray-400",
    "text-gray-400",
    "text-blue-500",
    "text-red-500",
    "text-green-500",
    "cols-span-2",
    'bg-green-100/40', 'dark:bg-green-900/10', 'border-green-300',
    'bg-red-100/40', 'dark:bg-red-900/10', 'border-red-300',
    'bg-purple-100/40', 'dark:bg-purple-900/10', 'border-purple-300',
  ],
  plugins: [],
}