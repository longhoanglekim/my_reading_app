/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',  // ← 'class' (not 'media'!)
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        // add any other paths where you use Tailwind classes
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}