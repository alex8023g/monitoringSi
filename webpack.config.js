const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    main: ['webpack-hot-middleware/client?reload=true', './src/main.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'development',
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

};