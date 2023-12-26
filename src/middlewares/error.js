const logger = require('../utils/logger');
const constants =  require('../constants').STATUS_CODES


const ErrorHandler = (err, req, res, next) => {
  logger.error(err)
  if (err.error_code=='parameter_notFound') {
    res.status(constants.NOT_FOUND).json({
      error_code: err.error_code || 'apiError',
      message: err.message || ''
    });

  } else if (err.error_code=='too_many_requests') {
    res.status(constants.TOO_MANY_REQUESTS).json({
      error_code: err.error_code || 'apiError',
      message: err.message || ''
    });

  } else if (err.error_code=='required_param_missing') {
    res.status(constants.BAD_REQUEST).json({
      error_code: err.error_code || 'apiError',
      message: err.message || ''
    });

  } else if (err.error_code=='header_authError') {
    res.status(constants.UNAUTHORISED).json({
      error_code: err.error_code || 'apiError',
      message: err.message || ''
    });

  } else if (err.validationErrors) {
    logger.error(err.validationErrors.body[0].message)
    res.status(constants.BAD_REQUEST).json({
      error_code: 'invalid_payload',
      message: err.validationErrors.body[0].message || err
    });
  }
  else {
    res.status(constants.SERVER_ERROR).json({
      error_code: err.error_code || err.errors ? err.errors.error_code : 'apiError',
      message: err.message || err.errors.message || 'internal server error'
    });
  }
};

const NotFoundErrorHandler = (req, res) => {
  res.status(constants.NOT_FOUND).json({
    error_code: 'route_not_found'
  });
};

module.exports = [ErrorHandler, NotFoundErrorHandler];
