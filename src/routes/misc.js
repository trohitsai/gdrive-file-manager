const Express = require('express');
const Router = Express.Router();

const miscController = require('../controllers/misc');

Router.use('/', miscController);

module.exports = Router;