const Express = require('express');

const Router = Express.Router();
const filesRoutes = require('./files')
const authRoutes = require('./auth')
const miscRoutes = require('./misc')

Router.use(filesRoutes)
Router.use(authRoutes)
Router.use(miscRoutes)

module.exports = Router;