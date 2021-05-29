const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const outputDirectory = 'dist';

module.exports = (env) => {
  //const currentPath = path.join(__dirname)

  return {
    // mode: 'development',
    devtool: 'source-map',
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    entry: ['babel-polyfill', './src/index.js'],
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'myapp.[hash].js',
      publicPath: '',
    },
    devServer: {
      hot: true,
      watchContentBase: true,
      historyApiFallback: true,
      contentBase: [path.resolve(__dirname, 'public'), path.resolve(__dirname, 'build')],
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'url-loader?limit=100000',
        },
      ],
    },
    resolve: {
      alias: {
        app: path.resolve(__dirname, 'src/'),
      },
    },

    plugins: [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: [outputDirectory],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
      }),
      new CopyWebpackPlugin({ patterns: [{ from: 'public/assets', to: 'assets' }] }),
    ],
  };
};
