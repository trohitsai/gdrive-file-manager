const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const fileshandler = require('../handlers/files');

// const { Validator } = require("express-json-validator-middleware");
// const { validate } = new Validator();

Router.get('/files', async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await fileshandler.getFiles(req.query.access)
    
    if (errors){
      throw errors
    }

    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
});

Router.get('/files/permissions', async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await fileshandler.getFilePermissions(req.query.access, req.query.fileid)
    
    if (errors){
      throw errors
    }

    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
});

Router.get('/files/download', async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await fileshandler.downloadFile(req.query.access, req.query.fileid)
    
    if (errors){
      throw errors
    }

    res.download(data);
    //res.send()
  } catch (error) {
    next(error);
  }
});

Router.get('/auth/google/callback', async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await fileshandler.handleCallback(req.query.code)
    
    if (errors){
      throw errors
    }

    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
