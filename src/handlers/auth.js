const logger = require('../utils/logger');
const { google } = require('googleapis');
const { clientId, clientSecret, redirectUri, rootPath } = require('../../config')

async function getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/drive'];
    const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    // First create the authentication URL from server and pass to FE
    const authUrl = authClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    });
    logger.info(authUrl)
    
    return {
        data: {url:authUrl},
        statusCode: 200
    }
}

async function handleCallback(code) {

    if (!code) {
        return {
            errors: {
                error_code: 'required_param_missing',
                message: 'missing requird parameter code'
            }
        }
    }

    try {
        const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        // get access token & refresh tokens with authorization code
        const { tokens } = await authClient.getToken(code);
        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;
        authClient.setCredentials({ refresh_token: refreshToken, access_token:accessToken });

        logger.info('Authentication successful!');
        return {
            data: { refresh_token: refreshToken, access_token:accessToken },
            statusCode: 200
        }
    } catch (error) {
        return {
            errors: error
        }
    }
}
module.exports = {getAuthUrl, handleCallback}