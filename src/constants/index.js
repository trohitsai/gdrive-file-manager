// store all app level constants here

const STATUS_CODES  = {
    SUCCESS : 200,
    SUCCESS_NO_CONTENT : 204,
    NOT_FOUND : 404,
    BAD_REQUEST : 400,
    UNAUTHORISED: 401,
    REQUEST_FAILED :  402,
    FORBIDDEN : 403,
    TOO_MANY_REQUESTS : 429,
    SERVER_ERROR : 500
}

module.exports={
    STATUS_CODES
}