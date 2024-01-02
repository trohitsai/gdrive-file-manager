
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
5. Ngrok to tunnel request from drive to localhost for getting webhook notifications from google drive file changes

# API Endpoints
- GET auth/url: Get authentication url for oauth screen
- GET auth/callback: Get access tokens after user consent from oauth screen using the code
- GET v1/files: List files on Google Drive
- GET v1/files/download: Download a file from Google Drive
- GET v1/files/permissions: Get file permissions and see whom the file is shared with
- POST /events/hook: Webhooks receiving URL 

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

6. Setup redis server
  
  Install redis & redis-server 
```bash
brew install redis
```
  Once installed start the redis-sever by simply running below command in a new terminal
```bash
redis-server
```

7. Run the microservice:
```bash
node src/app.js
```
The microservice will be accessible at http://localhost:3000 by default.

8. Now follow the OAuth flow and generate the access token.

- First use GET:/auth/url enpoint to get authentication url for oauth screen. Make sure you use Authorization as your PRIVATE_AUTH_TOKEN.
- Open this url in a browser tab where the google account (which is added as a test user in GCP setup) is already logged in.
- Accept the consent for the app and get the OAuth code from the browser url (code=XXXX).
  <img width="1726" alt="Screenshot 2024-01-02 at 10 23 20 AM" src="https://github.com/trohitsai/gdrive-file-manager/assets/23382685/f1bbf313-07db-4807-a1d8-c30c74ee0ddf">
  
- Now use GET auth/callback endpoint to get access token for the test user. Make sure you use Authorization as your PRIVATE_AUTH_TOKEN. Add code as query param in this api and pass the value fetched from previous step.
- In response you will the google test user's oauth access token.

8. Setting up ngrok

Install ngrok in your system. Refer https://ngrok.com/download for downloading

Once installed create a public endpoint for port 3000 where our node app is running

```bash
ngrok http 3000
```
This will create a public url pointing to port 3000. Keep a note of it.

9. Setting up Google notifications

Now since we have a public url for our node service we need add the our webhook endpoint (ngrok_url + /events/hook) in google webhook notifications.

Follow the guide mentioned here https://developers.google.com/drive/api/guides/push#creating-notification-channels. 
Use access token as Auth header created above in google POST:/drive/v3/changes/watch method. 
As soon as this done our server should start getting requests on POST:/events/hook endpoint from google.

# Usage
Make requests to the API endpoints using your preferred HTTP client or tool.

Example: List files on Google Drive

```bash
curl --location 'http://localhost:3001/v1/files' \
--header 'Authorization: Bearer XXX'
```

# Testing the integration

Once **google-file-manager** service is setup done our backend is ready. 
We need to setup & start socket-server (https://github.com/trohitsai/socket-server) which is our pub/sub service for websockets.

Once this done we need to add the user access token in index.html file under socket-server codebase.
```javascript
var token = 'Bearer XXXXXX'
```
Now open the index.html file in any browser. It should display the user google drive file details in the UI.
<img width="1137" alt="Screenshot 2024-01-02 at 10 26 52 AM" src="https://github.com/trohitsai/gdrive-file-manager/assets/23382685/bfaae828-1d14-4dbb-9134-dfc17668d0aa">

Upon updating any file metadata like name, permissions the UI will automtically Poll and refresh to show updated data.
