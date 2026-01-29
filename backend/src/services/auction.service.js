const redis = require("../config/redis");
const Item = require("../models/Item");

async function finalizeAuctionOnce(itemId) {
  const redisKey = `auction:${itemId}`;

 
  const auction = await redis.hgetall(redisKey);
  if (!auction) return;

  
  if (auction.persisted === "true") return;


  if (auction.ended !== "true") return;

  
  await Item.updateOne(
    { _id: itemId, status: "LIVE" },
    {
      $set: {
        status: "ENDED",
        finalBid: Number(auction.currentBid || 0),
        winnerClientId: auction.highestBidderClientId || null,
      },
    }
  );

 
  await redis.hset(redisKey, "persisted", "true");

 
  await redis.expire(redisKey, 3600); 

  
}

module.exports = { finalizeAuctionOnce };
