/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#1E293B',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 6px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
