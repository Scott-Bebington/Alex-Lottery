import { light } from "@mui/material/styles/createPalette";
import type { Config } from "tailwindcss";

const config: Config = {
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

        light: {
          background: '#FFFFFF',
          text: '#000000',
          // Add other light mode colors here
        },
        dark: {
          card: '#141414',
          text: '#FFFFFF',
          // Add other dark mode colors here
        },
      },
      margin: {
        'small': '0.75rem',  
        'medium': '1.5rem',
        'large': '2.5rem',
      },
      padding: {
        'small': '0.75rem',  
        'medium': '1.5rem',
        'large': '2.5rem',
      },
    },
    fontSize: {
      'title': '3rem',
      'subtitle': '2rem',
      'body': '1rem',
    },
    screens: {
      'sm': '600px',
      // => @media (min-width: 600px) { ... }
    
      'md': '850px',
      // => @media (min-width: 850px) { ... }
    
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
    
      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1525px',
      // => @media (min-width: 1525px) { ... }

      '3xl': '1920px',
      // => @media (min-width: 1920px) { ... }
    },
  },
  plugins: [],
};
export default config;
