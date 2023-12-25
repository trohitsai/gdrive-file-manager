const Express = require('express');
const Router = Express.Router();

const authController = require('../controllers/auth');

Router.use('/v1', authController);

module.exports = Router;