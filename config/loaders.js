'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

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
    sourceMap: isDevelopment, // turned off as causes delay
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
    sourceMap: isDevelopment, // turned off as causes delay
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
      sourceMap: isDevelopment,
    },
  },
};

const styleLoader = isDevelopment
  ? 'style-loader'
  : MiniCssExtractPlugin.loader;

module.exports = {
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
};
