'use strict'

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    browser: ['webpack-hot-middleware/client', './src/browser']
  },
  output: {
    path: path.join(__dirname, './build/static'),
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: /(src)/,
        options: {
          babelrc: false,
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: ['last 2 Chrome versions']
                }
              }
            ],
            'stage-3'
          ],
          plugins: ['transform-flow-strip-types', ['transform-react-jsx', {pragma: 'el'}]]
        }
      },
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader'
              }
            ]
          })
        )
      },
      {
        test: /worker\.js$/,
        use: {loader: 'worker-loader'}
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
    new ManifestPlugin(),
    new webpack.DefinePlugin({
      __HOT__: 'true',
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
