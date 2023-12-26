const Express = require('express');
const Router = Express.Router();

Router.use('/v1/files', async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(403).json({error:'Authorization is missing'})
        }
        else if(req.headers.authorization.startsWith("Bearer ")){
            req.body.access_token = req.headers.authorization.substring(7, req.headers.authorization.length);
        } 
        else {
            res.status(400).json({error:'invalid auth header passed'})
        }
        next()
    } catch (error) {
        next(error)
    }

})

module.exports=Router