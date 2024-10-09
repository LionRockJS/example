/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./samples/*.html",
    "../views/{layout,templates,snippets,sections}/**/*.liquid",
    "../../node_modules/@lionrockjs/mod-admin/views/{layout,templates,snippets,sections}/**/*.liquid",
    "../../node_modules/@lionrockjs/view-admin-cms/{layout,templates,snippets,sections}/**/*.liquid",
  ],
  theme: {
    screens:{
      'sm': '480px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1500px',
      '3xl': '1800px',
      '4xl': '2200px',
    },
    fontFamily:{
      'sans': ['josefin-sans', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', '"Liberation Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      'serif': ['optima-nova', 'Georgia', '"Times New Roman"', 'Times', 'sans-serif'],
      'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
    extend: {
      aspectRatio:{
        'jumbo-hero': "1.7",
        'jumbo-hero-mobile': "0.5625",
        'jumbo-hero-tablet': "0.8630",
        'feature': "0.9",
        'article': "1.22",
        'half-image': "1.5144",
        '4/3': "4 / 3",
      },
      colors:{
        'primary': '#3d2a80',
        'secondary': '#6E4A83',
        'dark': "#2c2659",
        'light': "#EEEEEE",
      },
      fontSize: {
        'sm':   ['0.8rem', 1.25],
        'md':   ['0.875rem', 1.25],
        'base': ['1rem', 1.25], // 16px
        'xl':   ['1.125rem', 1.25],
        '2xl':  ['1.375rem', 1.25],
        '3xl':  ['2.375rem', 1.25],
        '4xl':  ['3.25rem', 1.25],
        '5xl':  ['4.625rem', 1.25],
        'h6': ['1rem', 1.25],
        'h5': ['1.63rem', 1.25],
        'h4': ['2.18rem', 1.25],
        'h3': ['3.65rem', 1.25],
        'h2': ['4.5rem', 1.25],
        'h1': ['5rem', 1.25],
        'h1-xl':['5rem', 1.25]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}