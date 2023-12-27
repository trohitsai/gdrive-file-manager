const {publish} = require('../services/redis')

async function handleNotifications(event){
    // pushlishing the drive webhook data to Redis pub/sub service
    await publish(event)
}

module.exports={
    handleNotifications
}