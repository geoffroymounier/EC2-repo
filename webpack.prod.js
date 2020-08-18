const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
} );

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          ecma: 6,
        }
      }),
    ],
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor_app',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  plugins: [
    new CompressionPlugin({cache: true,}),
    new webpack.DefinePlugin({
      'process.env': dotenv.parsed,
    }),
  ],
});