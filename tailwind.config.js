import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'apple': "url('../images/apple-bg.jpg')",
            },
            colors: {
                'apple-bar': '#e8e6df',
                'apple-selected': '#d4d3cc',
            },
            fontFamily: {
                sans: ['Inter var', 'Gluten', ...defaultTheme.fontFamily.sans],
                mono: ['Major Mono Display', 'Syne Mono', ...defaultTheme.fontFamily.mono],
                elite: ['Special Elite', ...defaultTheme.fontFamily.sans],
                inter: ['Inter'],
            }
        },
    },
    plugins: [],
}

