const {publish} = require('../services/redis')

async function handleNotifications(event){
    // pushlishing the drive webhook data to Redis pub/sub service
    let response = await publish(event)
    console.log(response)
}

module.exports={
    handleNotifications
}