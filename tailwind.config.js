/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                '2xl': '1700px', // Punto di interruzione personalizzato per la sidebar
            },
        },
    },
    plugins: [],
}