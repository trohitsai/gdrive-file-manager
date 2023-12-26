const port = process.env.PORT || 3001;
const env = process.env.ENV || "dev";
const redisConf  = {
    url :"redis://localhost:6379"
}
const gcp_credentials_file = process.env.CREDENTIALS_FILE_PATH
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const rootPath = process.env.ROOT_DOWNLOAD_PATH;
const private_auth_token = process.env.PRIVATE_AUTH_TOKEN;

module.exports = {
    port, redisConf, env, gcp_credentials_file, clientId, clientSecret, redirectUri, rootPath, private_auth_token
};