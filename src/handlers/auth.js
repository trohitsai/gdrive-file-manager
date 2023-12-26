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
        data: authUrl,
        statusCode: 200
    }
}

async function handleCallback(code) {
    const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    try {
        // Exchange the authorization code for access and refresh tokens
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
        console.error('Error authenticating:', error);
        return {
            errors: "",
            statusCode: 400
        }
    }
}
module.exports = {getAuthUrl, handleCallback}