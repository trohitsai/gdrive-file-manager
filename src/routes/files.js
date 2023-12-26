const Express = require('express');
const Router = Express.Router();

const filesController = require('../controllers/files');

Router.use('/v1', filesController);

module.exports = Router;