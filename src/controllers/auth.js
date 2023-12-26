const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const authHandler = require('../handlers/auth');

// const { Validator } = require("express-json-validator-middleware");
// const { validate } = new Validator();

Router.get('/auth/url', async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await authHandler.getAuthUrl()
    
    if (errors){
      throw errors
    }

    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
});

Router.get('/auth/callback', async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await authHandler.handleCallback(req.query.code)
    
    if (errors){
      throw errors
    }

    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = Router;