const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/guestbook.js',
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  module : {
    rules: [
        {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
    }
],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'guestbook.html'),
    }),
  ],
};