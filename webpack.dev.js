  
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
});
module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': dotenv.parsed,
    }),
  ],
});