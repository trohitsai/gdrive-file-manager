const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const fileshandler = require('../handlers/files');
const mischandler = require('../handlers/misc');


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

Router.post('/events/hook', async (req, res, next) => {
  try {
    // below headers are passed by google drive webhooks, they rarely send request body
    console.log(req.headers)
    console.log(req.body)
    
    // header x-goog-resource-state tells us what type of change has occured in drive
    // for some reason its always 'change' nomatter i delete, add or share file with new users
    if(req.headers['x-goog-resource-state']=='change') {
      mischandler.handleNotifications({
        id: '123456',
        resource_id: req.headers['x-goog-resource-id'],
        change_type: 'drive_file',
        file_id: 'documentId1'
      })
    }
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
