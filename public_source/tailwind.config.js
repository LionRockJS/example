/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../views/{layout,templates,snippets,sections}/**/*.liquid",
    "../node_modules/@lionrockjs/mod-admin/views/{layout,templates,snippets,sections}/**/*.liquid",
  ],
  theme: {
    screens:{
      'sm': '414px',
      'md': '768px',
      'lg': '993px',
      'xl': '1312px',
      '2xl': '1552px',
    },
    fontFamily:{
      'sans': ["Work Sans", "Helvetica", "Arial", "sans-serif"],
      'serif': ["georgia", "serif"],
      'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
    extend: {
      aspectRatio:{
        'jumbo-hero': "1.7",
        'feature': "0.9",
        'article': "1.22",
      },
      colors:{
        'crate': {
          '100': '#EEE2CF',
          '200': '#EEE2CF',
          '300': '#E7C28A',
          '400': '#E7C28A',
          '500': '#C7A67D',
          '600': '#C7A67D',
          '700': '#C7A67D',
          '800': '#C7A67D',
          '900': '#C7A67D',
        },
        'cellar': {
          '100': '#F5F3F1',
          '200': '#ECE7E3',
          '300': '#C6C0B7',
          '400': '#C6C0B7',
          '500': '#9D9489',
          '600': '#9D9489',
          '700': '#9D9489',
          '800': '#9D9489',
          '900': '#9D9489',
        },
        fontSize: {
          'sm':   ['0.8rem', '1rem'],
          'md':   ['0.875rem', '1.375rem'],
          'base': ['1rem', '1.625rem'], // 16px
          'xl':   ['1.125rem', '1.75rem'],
          '2xl':  ['1.375rem', '1.75rem'],
          '3xl':  ['2.375rem', '3rem'],
          '4xl':  ['3.25rem', '3.875rem'],
          '5xl':  ['4.625rem','5.25rem'],
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}