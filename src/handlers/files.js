const fs = require('fs');
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

async function getFiles(accessToken) {
    try {
        const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        authClient.setCredentials({ access_token : accessToken });

        const drive = google.drive({version: "v3", auth: authClient});
        const response = await drive.files.list({ pageSize: 30, fields: 'files(name, id)',});

        return {
            data: response.data.files,
            statusCode: 200
        }
      } catch (err) {
        console.error('Error listing all files:', err);
        return {
            errors: " ",
            statusCode: 400
        }
    }
}

async function getFilePermissions(accessToken, fileId) {
    try {
        let permissions_response=[]

        const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        authClient.setCredentials({ access_token:accessToken });

        var drive = google.drive({version: "v3", auth: authClient,});
        const response = await drive.permissions.list({
            fileId: fileId
        });

        logger.info(`listed permissions`)

        for (const permission of response.data.permissions) {
            if (permission.role!='owner'){
                let permission_response = await drive.permissions.get({
                    fileId: fileId,
                    permissionId: permission.id,
                    fields: 'emailAddress,role,id,displayName,type'
                });
                permissions_response.push(permission_response.data)           
            }
        }
        return {
            data: permissions_response,
            statusCode: 200
        }
      } catch (err) {
        console.error('Error getting file permissions:', err);
        return {
            errors:"",
            statusCode: 400
        }
    }
}

// async function downloadFile1(accessToken, fileId) {
//     try {
//         const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
//         authClient.setCredentials({ access_token:accessToken });

//         var drive = google.drive({version: "v3", auth: authClient,});

//         const file = await drive.files.get({
//             fileId: fileId,
//             fields: 'webContentLink',
//             }
//         );

//         logger.info(file.data.webContentLink)
//         return {
//             data: file.data.webContentLink,
//             statusCode: 200
//         }
//       } catch (err) {
//         console.error('Error downloading file', err);
//         return {
//             errors:"",
//             statusCode: 400
//         }
//     }
// }

async function downloadFile(accessToken, fileId) {
    try {
        const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        authClient.setCredentials({ access_token:accessToken });

        var drive = google.drive({version: "v3", auth: authClient,});

        const fileStream = fs.createWriteStream(`${rootPath}/file.pdf`)

        const file = await drive.files.get({
            fileId: fileId,
            alt: 'media',
            }, 
            {
                responseType: "stream"
            }
        );

        file.data.on('end', () => console.log('onCompleted'))
        await file.data.pipe(fileStream);
        return {
            data: `${rootPath}/file.pdf`,
            statusCode: 200
        }
      } catch (err) {
        console.error('Error downloading file', err);
        return {
            errors:"",
            statusCode: 400
        }
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

module.exports = {getAuthUrl, handleCallback, getFiles, getFilePermissions, downloadFile}