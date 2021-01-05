const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const buildPath = path.resolve(__dirname, './build')
module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'bundle.min.js',
    sourceMapFilename: 'bundle.min.js.map'
  },
  devServer: {
    port: 8082,
    contentBase: buildPath,
    publicPath: '/',
    watchContentBase: true,
    historyApiFallback: true,
    // proxy: {
    //   '/zoomexternalapi': {
    //     target: process.env.API_URL,
    //     // pathRewrite: { "^/zoomexternalapi": "" },
    //     changeOrigin: true,
    //   },
    // },
    proxy: [{
      context: ['/doLogin', '/checkLogin', '/insertUser', '/getUsers', '/updateUser', '/getFactories', '/insertFactory',
        '/updateFactory', '/insertItem', '/getClassificationAndItemTree', '/getFactory', '/insertClassification', '/insertAudit', '/getAudit', '/logout',
        '/updateItem'
      ],
      target: 'http://local.safetag.com',
      changeOrigin: true
    }]

  },
  plugins: [
    // process.env.NODE_ENV == "development" ?
    new HtmlWebpackPlugin({
      title: 'SafETag',
      filename: 'index.html',
      template: './static/template.hbs',
      // css: process.env.CSS_PATH,
      bundle: 'bundle.min.js',
      inject: false
    }),
    // : () => { },
    new webpack.EnvironmentPlugin(process.env)
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  }
}
