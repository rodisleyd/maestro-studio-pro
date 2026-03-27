import tailwindAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        // Rotação lenta para o ícone de estúdio ativo
        'spin-slow': 'spin 12s linear infinite',
      },
      colors: {
        // Cor de fundo oficial do Maestro Studio PRO
        background: '#0a0a0c',
      }
    },
  },
  // Utilizando a importação ESM para maior compatibilidade com o Vite
  plugins: [tailwindAnimate],
}