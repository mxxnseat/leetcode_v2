import path from 'path';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: '/',
    filename: 'main.js',
    path: path.resolve('dist'),
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
    port: 3000,
  },
  plugins: [new HtmlWebpackPlugin(), new Dotenv()],
};
