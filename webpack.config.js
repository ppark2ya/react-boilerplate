/**
 * @see https://github.com/JonathanCallewaert/SWC-Typescript-Webpack-React-Emotion
 * @see https://github.com/LukeGeneva/swc-react-template
 * @see https://webpack.js.org/loaders/
 * @see https://michaelceber.medium.com/how-to-setup-and-use-css-modules-in-react-with-webpack-7f512b946ae0
 */

const path = require('path');
const rimraf = require('rimraf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const devMode = process.env.NODE_ENV !== 'production';

const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      mode: 'local',
      auto: true,
      exportLocalsConvention: 'camelCase',
      localIdentName: '[name]_[local]_[hash:base64:5]',
    },
    importLoaders: 2,
    sourceMap: devMode, // turned off as causes delay
  },
};

// For our normal CSS files we would like them globally scoped
const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      mode: 'global',
      auto: true,
      exportLocalsConvention: 'camelCase',
    },
    importLoaders: 2,
    sourceMap: devMode, // turned off as causes delay
  },
};

const SASSLoader = {
  loader: 'sass-loader',
  options: {
    // Prefer `dart-sass`
    implementation: require('sass'),
    sassOptions: {
      fiber: require('fibers'),
      indentWidth: 4,
      includePaths: [path.resolve(__dirname, 'styles/')],
      sourceMap: devMode,
    },
  },
};

// Standard style loader (prod and dev covered here)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const styleLoader = devMode ? 'style-loader' : MiniCssExtractPlugin.loader;
rimraf.sync(path.resolve(__dirname, 'dist'));

module.exports = {
  mode: 'none',
  devtool: devMode ? 'eval-source-map' : 'source-map',
  entry: './src/index.tsx',
  output: {
    clean: true,
    filename: '[name].bundle.js',
    chunkFilename: '[id].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: 'swc-loader',
        },
      },
      {
        test: /\.(sa|sc|c|pc)ss$/i,
        exclude: /\.module\.(sa|sc|c|pc)ss$/,
        use: [styleLoader, CSSLoader, 'postcss-loader', SASSLoader],
      },
      {
        test: /\.module\.(sa|sc|c|pc)ss$/,
        use: [styleLoader, CSSModuleLoader, 'postcss-loader', SASSLoader],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              options: {
                prettier: false,
                svgo: false,
                svgoConfig: {
                  plugins: [{ removeViewBox: false }],
                },
                titleProp: true,
                ref: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[hash].[ext]',
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '~': path.resolve(__dirname, 'src/'),
    },
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          filename: 'index.html',
          template: path.join(__dirname, 'public/index.html'),
        },
        !devMode
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined,
      ),
    ),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    /**
     * @desc "process.env" undefined solution
     * @see https://stackoverflow.com/a/66250238
     */
    new dotenv(),
    /**
     * @see https://fgh0296.tistory.com/19
     */
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
    }),
  ],
  devServer: {
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  performance: { hints: false },
};
