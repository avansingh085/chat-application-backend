// redis-client.js
const { REDIS_PASS, REDIS_ENDPOINT, REDIS_PORT }  =require('./server-config.js');
const Redis=require('ioredis');

const REDIS_URL = `rediss://default:${REDIS_PASS}@${REDIS_ENDPOINT}:${REDIS_PORT}`;

const redis = new Redis(REDIS_URL, {
  tls: { rejectUnauthorized: false }
});

redis.on('connect', () => {
  console.log(' Redis connected');
});

redis.on('error', (err) => {
  console.error(' Redis error:', err);
});

module.exports= redis;
