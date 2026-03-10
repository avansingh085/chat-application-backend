const { safeRedisGet, safeRedisSet } = require("../../config/redis.config");

module.exports = (socket) => {

  socket.on("deleteNotification", async (notificationKey) => {
    await safeRedisSet(
      `Notifications-${notificationKey}`,
      JSON.stringify({ count: 0 })
    );

    socket.emit("notification", {
      count: 0,
      notificationKey
    });
  });

  socket.on("notification", async (notificationKey) => {
    const rawData = await safeRedisGet(`Notifications-${notificationKey}`);

    const data = rawData
      ? typeof rawData === "string"
        ? JSON.parse(rawData)
        : rawData
      : { count: 0 };

    socket.emit("notification", {
      count: data.count,
      notificationKey
    });
  });

};