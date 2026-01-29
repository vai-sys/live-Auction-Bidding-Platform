const Item = require("../models/Item");
const redis = require("../config/redis");

async function getItemsWithCurrentBid() {
  const items = await Item.find().lean();
  const result = [];

  for (const item of items) {
    const redisKey = `auction:${item._id}`;
    const auctionState = await redis.hgetall(redisKey);

    const isEnded =
      auctionState?.ended === "true" ||
      item.status === "ENDED";

    result.push({
      _id: item._id,
      title: item.title,
      startingPrice: item.startingPrice,

      currentBid: isEnded
        ? item.finalBid
        : auctionState?.currentBid
        ? Number(auctionState.currentBid)
        : item.startingPrice,

      auctionEndTime: item.auctionEndTime,
      status: isEnded ? "ENDED" : "LIVE",

      highestBidderClientId: isEnded
        ? item.winnerClientId
        : auctionState?.highestBidderClientId || null,
    });
  }

  return result;
}

module.exports = { getItemsWithCurrentBid };
