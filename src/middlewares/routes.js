const Express = require('express');
const Router = Express.Router();
const {private_auth_token} = require('../../config');
const {STATUS_CODES} = require('../constants');

Router.use('/v1/files', async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({error:'Authorization is missing'})
        }
        else if(req.headers.authorization.startsWith("Bearer ")){
            req.body.access_token = req.headers.authorization.substring(7, req.headers.authorization.length);
        } 
        else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({error:'invalid auth header passed'})
        }
        next()
    } catch (error) {
        next(error)
    }

})

Router.use('/auth', async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({error:'Authorization is missing'})
        }
        else if(req.headers.authorization.startsWith("Basic ")){
            private_token_passed = req.headers.authorization.substring(6, req.headers.authorization.length);
            if(private_token_passed!=private_auth_token) {
                return res.status(STATUS_CODES.FORBIDDEN).json({error:'invalid credentials'})
            }
        } 
        else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({error:'invalid auth header passed'})
        }
        next()
    } catch (error) {
        next(error)
    }

})

module.exports=Router