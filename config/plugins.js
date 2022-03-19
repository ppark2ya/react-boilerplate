'use strict';

const path = require('path');
const paths = require('./paths');
const rimraf = require('rimraf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

rimraf.sync(path.resolve(__dirname, '../dist'));

const plugins = [
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        filename: 'index.html',
        template: paths.appHtml,
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
  /**
   * @desc "process.env" undefined solution
   * @see https://stackoverflow.com/a/66250238
   */
  new dotenv(),
  new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
    PUBLIC_URL: paths.publicUrlOrPath.slice(0, -1),
  }),
];

/**
 * @see https://fgh0296.tistory.com/19
 */
if (isProduction) {
  plugins.push(
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
    }),
  );

  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          filter: async (resourcePath) => {
            const fileName = path.basename(resourcePath);

            if (
              fileName === 'index.html' ||
              fileName === 'mockServiceWorker.js'
            ) {
              return false;
            }

            return true;
          },
        },
      ],
    }),
  );
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
