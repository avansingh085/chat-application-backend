const { safeRedisSet } = require("../config/redis.config");

const setUserOnline = async (userId, socketId) => {
  await safeRedisSet(
    `Users-${userId}`,
    JSON.stringify({ isOnline: true, socketId })
  );
};

const setUserOffline = async (userId) => {
  await safeRedisSet(
    `Users-${userId}`,
    JSON.stringify({ isOnline: false, socketId: null })
  );
};

module.exports = { setUserOnline, setUserOffline };