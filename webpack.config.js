/**
 * @see https://github.com/JonathanCallewaert/SWC-Typescript-Webpack-React-Emotion
 * @see https://github.com/LukeGeneva/swc-react-template
 * @see https://webpack.js.org/loaders/
 * @see https://michaelceber.medium.com/how-to-setup-and-use-css-modules-in-react-with-webpack-7f512b946ae0
 */

const path = require('path');
const loaders = require('./config/loaders');
const plugins = require('./config/plugins');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'none',
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  entry: './src/index.tsx',
  output: {
    clean: true,
    filename: '[name].bundle.js',
    chunkFilename: '[id].js',
  },
  module: loaders,
  resolve: {
    extensions: ['*', '.js', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '~': path.resolve(__dirname, 'src/'),
    },
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
  },
  plugins,
  devServer: {
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  performance: { hints: false },
};
