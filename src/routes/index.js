const Express = require('express');

const Router = Express.Router();
const filesRoutes = require('./files')
const authRoutes = require('./auth')

Router.use(filesRoutes)
Router.use(authRoutes)

module.exports = Router;