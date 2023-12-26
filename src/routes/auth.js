const Express = require('express');
const Router = Express.Router();

const authController = require('../controllers/auth');

Router.use('/', authController);

module.exports = Router;