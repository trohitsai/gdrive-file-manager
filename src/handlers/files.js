const fs = require('fs');
const logger = require('../utils/logger');
const redis = require('../services/redis');
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
            data: {permissions: permissions_response},
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

async function downloadFile(accessToken, fileId) {
    try {
        const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        authClient.setCredentials({ access_token:accessToken });

        var drive = google.drive({version: "v3", auth: authClient,});

        return new Promise(async(resolve, reject) => {
            const fileData = await getFileDetails(drive, fileId, "name");
            const filepath=`${rootPath}/${fileData.name}`
            
            const fileStream = fs.createWriteStream(filepath)
            const file = await drive.files.get({fileId: fileId, alt: 'media',}, {responseType: "stream"});
    
            file.data.on('end', () => console.log('onCompleted'))
            file.data.pipe(fileStream);
            file.data.on("error", (err) => {
                reject({
                    errors:"error while file download",
                    statusCode: 500
                });
            });
            fileStream.on("finish", function() {
                resolve({
                    data: filepath,
                    statusCode: 200
                });
            });
        });
      } catch (err) {
        console.error('Error downloading file', err);
        return {
            errors:"",
            statusCode: 400
        }
    }
}

async function getFileDetails(serviceClient, fileId, fields='*') {
    let fileCache = await redis.getKey(fileId);
    if(fileCache) {
        return JSON.parse(fileCache)
    }
    let files = await serviceClient.files.get({fileId: fileId, fields: fields},);
    await redis.setKeyWithExpiry(fileId, 60*10, JSON.stringify(files.data));
    return files.data
}

module.exports = {getAuthUrl, getFiles, getFilePermissions, downloadFile}