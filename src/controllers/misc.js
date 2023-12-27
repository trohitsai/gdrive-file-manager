const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const miscHandler = require('../handlers/misc');

Router.get('/callback', async (req, res, next) => {
  try {
    res.send('<h1>OAuth Successful</h1>')
  } catch (error) {
    next(error);
  }
});

module.exports = Router;