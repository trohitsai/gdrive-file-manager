/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cfg = require('../config');
const APP = express();

const routes = require('./routes');
const middleWares = require('./middlewares');
const apiErrorMiddleWare = require('./middlewares/error');
const logger = require('./utils/logger');

APP.use(bodyParser.json());
APP.use(middleWares);
APP.use(routes);
APP.use(apiErrorMiddleWare);

// Application initialization
APP.listen(cfg.port, () => {
  logger.info(`SERVER STARTED PORT: ${cfg.port} ENV: ${cfg.env}`);
});
