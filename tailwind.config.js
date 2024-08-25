/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#64376E',
        secondary: '#4A9084',
        tertiary: '#B53475',
      },
      margin: {
        'small': '10px',  
        'medium': '25px',
        'large': '50px',
      },
      padding: {
        'small': '10px',
        'medium': '25px',
        'large': '50px',
      },
    },
    fontSize: {
      'title': '3rem',
      'subtitle': '2rem',
      'body': '1rem',
    },
    screens: {
      'sm': '600px',
      // => @media (min-width: 576px) { ... }
    
      'md': '850px',
      // => @media (min-width: 768px) { ... }
    
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
    
      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1525px',
      // => @media (min-width: 1525px) { ... }
    },
  },
  plugins: [],
};
