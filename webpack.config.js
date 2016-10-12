var webpack = require('webpack');
var path = require("path");

var lib_dir = __dirname + '/public/libraries',
  node_dir = __dirname + '/node_modules'

var config = {

  resolve: {
    alias: {
      react: node_dir + '/react',
      reactDom: node_dir + '/react-dom',
      jQuery: node_dir + '/jquery',
      moment: node_dir + '/moment',
      restful: node_dir + '/restful.js/',
      octokat: node_dir + '/octokat',
      lodash: node_dir + '/lodash',
      'react-toastr': node_dir + '/react-toastr',
      'react-countdown-clock': node_dir + '/react-countdown-clock',
      'react-toggle-button': node_dir + '/react-toggle-button',
      'react-copy-to-clipboard': node_dir + '/react-copy-to-clipboard',
      'react-bootstrap': node_dir + '/react-bootstrap'
    }
  },

  plugins: [
    new webpack.ProvidePlugin({
      '$': "jquery",
      'window.jQuery': "jquery",
      'jQuery': 'jquery',
      'window.$': 'jquery',
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'dist/js/vendors.js', Infinity)
  ],

  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],

  entry: {
    'releases-pipeline': './public/src/pages/releases-pipeline-page/js/main'
  },

  output: {
    path: path.join(__dirname, "public"),
    filename: "dist/js/[name].bundle.js"
  },

  module: {
    noParse: [
      new RegExp(lib_dir + './react.js'),
      new RegExp(lib_dir + './react-dom.js')
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot'],
        include: path.join(__dirname, 'public')

      },
      {
        loader: 'babel', //'jsx-loader'
        query: {
          presets: ['react', 'es2015']
        },
        include: path.join(__dirname, 'public')
      }
    ]
  }
};

module.exports = config;