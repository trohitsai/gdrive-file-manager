const redisHelper  = require('../services/redis');

async function verifyRequestRateLimits(payload) {
    let requestCount = await redisHelper.getKey(`${payload.userId}_purchase`)
    if (!requestCount){
        await redisHelper.setKeyWithExpiry(`${payload.userId}_purchase`, 10, 1)
        return false
    } else if (requestCount > 2){
        return true
    }
    else {
        await redisHelper.incrementKey(`${payload.userId}_purchase`)
        return false
    }
}

module.exports={verifyRequestRateLimits}