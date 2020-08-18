const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: { extensions: ['.js', '.jsx'] },
  entry : path.resolve(__dirname,'src','app'),
  output: {
    path: path.resolve(__dirname,'./dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    inline:true,
    port: 8008
},
  module: {
    rules: [
      {
        test : /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },

      {
          test: /\.s?css$/,
          use: [
            {
              loader: "style-loader" // creates style nodes from JS strings
            },
            {
              loader: "css-loader" // translates CSS into CommonJS
            },
            {
              loader: "sass-loader" // compiles Sass to CSS
            }
          ]
      }
    ]
  }
};