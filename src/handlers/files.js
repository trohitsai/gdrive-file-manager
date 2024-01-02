const fs = require('fs');
const logger = require('../utils/logger');
const redis = require('../services/redis');
const { google } = require('googleapis');
const { clientId, clientSecret, redirectUri, rootPath } = require('../../config')
const {STATUS_CODES} = require('../constants')

async function getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/drive'];
    const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    // First create the authentication URL from server and pass to FE
    const authUrl = authClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    });

    return {
        data: authUrl,
        statusCode: STATUS_CODES.SUCCESS
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
            statusCode: STATUS_CODES.SUCCESS
        }
      } catch (err) {
        logger.error(err);
        return {
            errors: {
                error_code: err.errors[0] ? `${err.errors[0].locationType}_${err.errors[0].reason}` : "files_error",
                message: err.message
            }
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

        logger.info(`Listed all permissions for file ${fileId}`)

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
            statusCode: STATUS_CODES.SUCCESS
        }
      } catch (err) {
        logger.error(err);
        // handling google drive errors
        return {
            errors:{
                error_code: err.errors[0] ? `${err.errors[0].locationType}_${err.errors[0].reason}` : 'permission_error',
                message: err.errors[0] ? `${err.errors[0].message}` : 'error while getting file permissions'
            }
        }
    }
}

async function downloadFile(accessToken, fileId) {
    try {
        const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        authClient.setCredentials({ access_token:accessToken });

        var drive = google.drive({version: "v3", auth: authClient,});

        return new Promise(async(resolve, reject) => {

            try {
                const fileData = await getFileDetails(drive, fileId, "name");
                const filepath=`${rootPath}/${fileData.name}`
                
                const fileStream = fs.createWriteStream(filepath)
                const file = await drive.files.get({fileId: fileId, alt: 'media',}, {responseType: "stream"});
        
                file.data.on('end', () => console.log('onCompleted'))
                file.data.pipe(fileStream);
                file.data.on("error", (err) => {
                    reject({
                        errors:{
                            error_code: err.errors[0] ? `${err.errors[0].locationType}_${err.errors[0].reason}` : '',
                            message: err.errors[0] ? `${err.errors[0].message}` : ''
                        }
                    });
                });
                fileStream.on("finish", function() {
                    resolve({
                        data: filepath,
                        statusCode: STATUS_CODES.SUCCESS
                    });
                });
                
            } catch (err) {
                if(err.errors) {
                    reject({
                        errors:{
                            error_code: err.errors[0] ? `${err.errors[0].locationType}_${err.errors[0].reason}` : '',
                            message: err.errors[0] ? `${err.errors[0].message}` : ''
                        }
                    });
                } else if(err.message) {
                    err = JSON.parse(err.message).error
                    reject({
                        errors:{
                            error_code: err.errors[0] ? `${err.errors[0].locationType}_${err.errors[0].reason}` : '',
                            message: err.errors[0] ? `${err.errors[0].message}` : ''
                        }
                    });
                }
            }
        });
      } catch (err) {
        console.error('Error downloading file', err);
        return {
            errors:{
                error_code: err.errors[0] ? `${err.errors[0].locationType}_${err.errors[0].reason}` : '',
                message: err.errors[0] ? `${err.errors[0].message}` : ''
            }
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

module.exports = {
    getAuthUrl, getFiles, getFilePermissions, downloadFile
}