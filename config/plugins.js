'use strict';

const path = require('path');
const rimraf = require('rimraf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Standard style loader (prod and dev covered here)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

rimraf.sync(path.resolve(__dirname, '../dist'));

const plugins = [
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        filename: 'index.html',
        template: path.join(__dirname, '../public/index.html'),
      },
      isProduction
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
];

/**
 * @see https://fgh0296.tistory.com/19
 */
if (isProduction) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
    }),
  );

  const dirPath = path.resolve(__dirname, '../public/static');

  if (fs.existsSync(dirPath)) {
    plugins.push(
      new CopyPlugin({
        patterns: [{ from: 'public/static', to: 'static' }],
      }),
    );
  }
} else {
  plugins.push(
    /**
     * @desc Webpack Bundle Analyzer is started at http://127.0.0.1:8888
     */
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
  );
}
module.exports = plugins;
