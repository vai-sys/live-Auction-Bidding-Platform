// jobs/auctionFinalizer.js
const redis = require("../config/redis");
const { finalizeAuctionOnce } = require("../services/auction.service");

function startAuctionFinalizer() {
  setInterval(async () => {
    const keys = await redis.keys("auction:*");

    const now = Math.floor(Date.now() / 1000);

    for (const key of keys) {
      const data = await redis.hgetall(key);

      if (!data || data.ended !== "false") continue;

      if (now >= Number(data.auctionEndTime)) {
        await redis.hset(key, "ended", "true");

        const itemId = key.split(":")[1];
        await finalizeAuctionOnce(itemId);
      }
    }
  }, 5000); 
}

module.exports = startAuctionFinalizer;
