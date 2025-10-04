/** @type {import('tailwindcss').Config} */
module.exports = {
  // This section tells Tailwind where to look for your class names.
  // It's configured for a standard Next.js App Router setup.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // The 'theme' section is where you can customize your design system.
  // 'extend' allows you to add new values without overwriting the defaults.
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // You can add custom fonts, colors, spacing, etc. here.
      // For example:
      // colors: {
      //   'brand-blue': '#1a73e8',
      // }
    },
  },

  // This section is where you add official or third-party plugins.
  // We've added the typography plugin to style your Markdown preview.
  plugins: [
    require('@tailwindcss/typography'),
  ],
};