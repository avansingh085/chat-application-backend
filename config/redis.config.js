const { REDIS_PASS } = require('./server.config.js');
const { createClient } = require('redis');
let redis = null;
const connectRedis = async () => {
  redis = createClient({
    username: 'default',
    password: REDIS_PASS,
    socket: {
      host: 'redis-13498.c82.us-east-1-2.ec2.cloud.redislabs.com',
      port: 13498
    }
  });

  redis.on('error', err => console.log('Redis Client Error', err));

  await redis.connect();
}

module.exports = { redis, connectRedis };
