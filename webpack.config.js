const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env = {}, argv) => {
  const isDevMode = argv.mode === 'development';

  const optimOptions = isDevMode
    ? {
        minimize: false,
      }
    : {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              output: {
                comments: false,
              },
            },
          }),
        ],
      };

  return {
    optimization: optimOptions,
    entry: {
      frontend: path.resolve(__dirname, 'src/frontend'),
      backend: path.resolve(__dirname, 'src/backend'),
    },
    output: {
      path: path.resolve(__dirname, 'assets/js'),
      filename: 'wpreactdev.[name].js',
    },
    module: {
      rules: [
        {
          parser: {
            amd: false,
          },
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          use: ['babel-loader'],
        },
        {
          test: /\.(s*)css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};
