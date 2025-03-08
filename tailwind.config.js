const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

module.exports = {
    content: [
        './src/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                redish: '#000'
                // Add semantic colors
            },
            fontFamily: {
                sans: ['var(--font-sans)', ...fontFamily.sans],
                mono: ['var(--font-mono)', ...fontFamily.mono],
            },
        },
    },
    plugins: [
        require('@tailwindcss/container-queries'),
        require('@tailwindcss/typography'),
        plugin(({ addVariant }) => {
            addVariant('hocus', ['&:hover', '&:focus']);
            addVariant('supports-backdrop', '@supports (backdrop-filter: blur(0px))');
        }),
    ],
};