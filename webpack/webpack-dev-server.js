/**
 * Webpack Dev Server
 * This file is used to run our local enviroment
 */
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const path = require('path');
const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');
const compression = require('compression');
const api = require('./api');
const history = require('connect-history-api-fallback');
const env = { dev: process.env.NODE_ENV === 'development' };

const devConfig = {
  hot: true,
  inline: true,
  https: false,
  lazy: false,
  contentBase: path.join(__dirname, '../../src/'),
  historyApiFallback: { disableDotRule: true }, // Need historyApiFallback to be able to refresh on dynamic route
  stats: { colors: true } // Pretty colors in console
};

const hotConfig = {
  log: console.log,
  path: '/__webpack_hmr'
};

try {
  const app = connect();

  const compiler = webpack(webpackConfig(env));

  // gzip/deflate outgoing responses 
  // app.use(compression());

  // parse urlencoded request bodies into req.body 
  // app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/api/get-data', api.middleware);

  app.use(history());

  // respond to all requests 
  app.use(webpackDevMiddleware(compiler, devConfig));
  app.use(webpackHotMiddleware(compiler, hotConfig));


  //create node.js http server and listen on port 
  http.createServer(app).listen(3000);
} catch (e) {
  console.error(e);
}


