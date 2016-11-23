const webpack = require('webpack');

module.exports = {
  devtool: 'sourcemap',
  entry: {
    relay: './relay.js',
    apollo: './apollo.js',
    lokka: './lokka.js',
  },

  plugins: [new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      output: {
        comments: false // Also removes licences
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  loaders: [
    { test: /\.json$/, loader: 'json-loader' },
  ],
  output: {
    path: 'build',
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  externals: {
    react: true,
    'react-dom': true,
    'graphql-tag': true,
    'babel-runtime/core-js/array/from': true,
    'babel-runtime/core-js/json/stringify': true,
    'babel-runtime/core-js/object/assign': true,
    'babel-runtime/core-js/object/freeze': true,
    'babel-runtime/core-js/object/get-prototype-of': true,
    'babel-runtime/core-js/object/keys': true,
    'babel-runtime/core-js/promise': true,
    'babel-runtime/helpers/classCallCheck': true,
    'babel-runtime/helpers/createClass': true,
    'babel-runtime/helpers/defineProperty': true,
    'babel-runtime/helpers/extends': true,
    'babel-runtime/helpers/inherits': true,
    'babel-runtime/helpers/possibleConstructorReturn': true,
    'node-fetch': true,
    'whatwg-fetch': true,
    'core-js': true,
    'redux': true,
  }
}
