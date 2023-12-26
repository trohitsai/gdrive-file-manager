
# Google File Manager Microservice
Overview
The **google-file-manager** microservice is a Node.js application that interacts with the Google Drive API to manage files on Google Drive. This microservice provides functionalities to perform various file operations such as handled oAuth flows, listing files, downloading files, and more.

# Features
- Create OAuth authentication URL
- Perform oauth flow and generate access tokens
- List files on Google Drive
- List the users the files are shared with
- Download files from Google Drive
- Received realtime events from google for any file changes in drive
  
...
# Prerequisites
Before running the microservice, ensure that you have the following:

1. Node.js installed (minimum version: 20.X.X)
2. npm (Node Package Manager) installed
3. Google Cloud Platform project with the Google Drive API enabled Refer : https://developers.google.com/drive/api/quickstart/nodejs
4. OAuth 2.0 credentials (client ID and client secret) for Google Drive API
5. ngrok to tunnel request from drive to localhost for getting webhook notifications from google drive file changes

# Setup
1. Clone the repository:

```bash
git clone https://github.com/your-username/google-file-manager.git
```
2. Navigate to the project directory:
```bash
cd google-file-manager
```
3. Install dependencies:
```bash
npm install
```
4. Set up OAuth 2.0 credentials:

  Create a credentials.json file with your OAuth 2.0 client ID and client secret obtained from the Google Cloud Console.
  Refer this doc here https://developers.google.com/drive/api/quickstart/nodejs#authorize_credentials_for_a_desktop_application

5. Create an env files and add all values. Refer the .env.example files
   ```bash
    PORT=3001
    ENV=dev
    CREDENTIALS_FILE_PATH=path/for/credentials/files/downloaded
    CLIENT_ID= Obtained from Gdrive setup in step 4
    CLIENT_SECRET= Obtained from Gdrive setup in step 4
    REDIRECT_URI= This an endpoint where your client will redirect post completion of oauth flow
    ROOT_DOWNLOAD_PATH= Path in your server where u want to store downloaded files
    PRIVATE_AUTH_TOKEN= A private auth token for your sever 'Basic xxxx'
   ```
7. Run the microservice:
```bash
node src/app.js
```

The microservice will be accessible at http://localhost:3001 by default.

# API Endpoints
GET auth/url: Get authentication url for oauth screen
GET auth/callback: Get access tokens after user consent from oauth screen using the code
GET v1/files: List files on Google Drive
GET v1/files/download: Download a file from Google Drive
GET v1/files/permissions: Get file permissions and see whom the file is shared with

# Usage
Make requests to the API endpoints using your preferred HTTP client or tool.

Example: List files on Google Drive

```bash
curl http://localhost:3001/v1/files
```

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Thanks to the Google Drive API for providing the foundation for this microservice.
