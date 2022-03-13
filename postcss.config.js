const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  map: isDev ? 'inline' : false,
  plugins: {
    'postcss-import': {},
    'postcss-flexbugs-fixes': {},
    /**
     * @see https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-focus-visible#readme
     * @see https://marshallku.com/web/tips/focus-visible%EB%A1%9C-%EC%A0%91%EA%B7%BC%EC%84%B1-%EB%86%92%EC%9D%B4%EA%B8%B0
     */
    'postcss-focus-visible': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
    tailwindcss: {},
    autoprefixer: {},
    cssnano: !isDev ? {} : false,
  },
};
