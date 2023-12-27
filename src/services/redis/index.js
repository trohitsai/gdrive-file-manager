const redis = require('redis');
const config = require('../../../config');
const logger = require('../../utils/logger');

const client = redis.createClient({
  url: config.redisConf.url
});

client.on('error', (error) => {
  logger.error(error);
});

async function getKey(key) {
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (err, reply) => {
        if (err) {
          logger.error(err)
          reject(err);
        }
        resolve(reply);
      });
    } catch (e) {
      logger.info('Exception while getting key: ', e);
    }
  });
}

async function setKeyWithExpiry(key, expiry, value) {
  return new Promise((resolve, reject) => {
    client.setex(key, expiry, value, (err, reply) => {
      if (err) {
        logger.error(err)
        reject(reply);
      }
      resolve(reply);
    });
  });
}

async function incrementKey(key) {
  return new Promise((resolve, reject) => {
    client.incr(key, (err, reply) => {
      if (err) {
        logger.error(err)
        reject(reply);
      }
      resolve(reply);
    });
  });
}

async function publish(event) {
  return new Promise((resolve, reject) => {
    client.publish(config.redisChannel, JSON.stringify(event), (err, reply) => {
      if (err) {
        logger.error(err)
        reject(reply);
      }
      logger.info(`published message to ${config.redisChannel}`)
      resolve(reply);
    });
  });
}

module.exports = {
  getKey,
  setKeyWithExpiry,
  incrementKey,
  publish
};
