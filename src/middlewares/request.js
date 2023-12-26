const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  req.data = {};
  const requestPath = req.path ? req.path : '';
  const requestMethod = req.method ? req.method : '';
  const stringifiedBody = JSON.stringify(req.body) || '';
  logger.info(`Request Info : [${requestMethod}] - ${requestPath} - ${stringifiedBody}`, {
    path: requestPath,
    method: requestMethod,
    headers: req.headers
  });
  next();
};
