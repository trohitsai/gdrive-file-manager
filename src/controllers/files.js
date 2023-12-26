const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const fileshandler = require('../handlers/files');

// const { Validator } = require("express-json-validator-middleware");
// const { validate } = new Validator();

Router.get('/files', async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await fileshandler.getFiles(req.body.access_token)
    
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
    const { statusCode, errors, data } = await fileshandler.getFilePermissions(req.body.access_token, req.query.fileid)
    
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
    const { statusCode, errors, data } = await fileshandler.downloadFile(req.body.access_token, req.query.fileid)
    
    if (errors){
      throw errors
    }

    res.download(data);
    //res.send()
  } catch (error) {
    next(error);
  }
});

Router.post('/events/hooks', async (req, res, next) => {
  try {
    console.log(req.headers)
    console.log(req.body)
    console.log("EVENT") 

  } catch (error) {
    next(error);
  }
});

module.exports = Router;
