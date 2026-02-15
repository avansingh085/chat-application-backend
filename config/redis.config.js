const { Redis } = require("@upstash/redis");
const { REDIS_ENDPOINT, REDIS_PASS } = require("./server.config.js");

const redis = new Redis({
  url: REDIS_ENDPOINT, 
  token: REDIS_PASS,
});

const safeRedisGet = async (key) => {
  try {
    return await redis.get(key);
  } catch (err) {
    return null;
  }
};

const safeRedisSet = async (key, value, ttl = 3600) => {
  try {
    await redis.set(key, value, { ex: ttl }); 
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  redis,
  safeRedisGet,
  safeRedisSet,
};