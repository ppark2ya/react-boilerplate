/**
 * @see https://github.com/JonathanCallewaert/SWC-Typescript-Webpack-React-Emotion
 * @see https://github.com/LukeGeneva/swc-react-template
 * @see https://webpack.js.org/loaders/
 * @see https://michaelceber.medium.com/how-to-setup-and-use-css-modules-in-react-with-webpack-7f512b946ae0
 */
const paths = require('./config/paths');
const loaders = require('./config/loaders');
const plugins = require('./config/plugins');
const ignoredFiles = require('react-dev-utils/ignoredFiles');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  entry: './src/index.tsx',
  output: {
    clean: true,
    filename: isProduction
      ? 'static/js/[name].[contenthash:8].js'
      : 'static/js/bundle.js',
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    publicPath: paths.publicUrlOrPath,
  },
  module: loaders,
  resolve: {
    extensions: ['*', '.js', '.ts', '.tsx'],
    alias: {
      '@': paths.appSrc,
      '~': paths.appSrc,
    },
    modules: [paths.appSrc, 'node_modules'],
  },
  plugins,
  devServer: {
    compress: true,
    port: 3000,
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
  },
  performance: { hints: false },
};
