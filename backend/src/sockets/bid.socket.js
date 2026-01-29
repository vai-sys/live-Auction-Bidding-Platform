


const redis = require("../config/redis");
const { finalizeAuctionOnce } = require("../services/auction.service");

function registerBiddingSocket(io) {
  io.on("connection", (socket) => {
    socket.on("BID_PLACED", async ({ itemId, bidAmount }) => {
      const clientId = socket.clientId;
      const redisKey = `auction:${itemId}`;
      const now = Math.floor(Date.now() / 1000);



     
      const luaScript = `
        local currentBid = tonumber(redis.call("HGET", KEYS[1], "currentBid"))
        local endTime = tonumber(redis.call("HGET", KEYS[1], "auctionEndTime"))
        local ended = redis.call("HGET", KEYS[1], "ended")
        local currentTime = tonumber(ARGV[1])
        local newBid = tonumber(ARGV[2])

        if not currentBid or not endTime then
          return "NOT_FOUND"
        end

        if ended == "true" then
          return "ENDED"
        end

        if currentTime >= endTime then
  if ended ~= "true" then
    redis.call("HSET", KEYS[1], "ended", "true")
  end
  return "ENDED"
 end


        if newBid <= currentBid then
          return "OUTBID"
        end

        redis.call("HSET", KEYS[1],
          "currentBid", ARGV[2],
          "highestBidderClientId", ARGV[3]
        )

        return "OK"
      `;

      let result;
      try {
     
        result = await redis.eval(
          luaScript,
          [redisKey],
          [now.toString(), bidAmount.toString(), clientId]
        );
      } catch (err) {
       
        socket.emit("BID_REJECTED", { reason: "ERROR", itemId });
        return;
      }

    

    
      if (result !== "OK") {
        if (result === "ENDED") {
        
          await finalizeAuctionOnce(itemId);
        }

        socket.emit("BID_REJECTED", { reason: result, itemId });
        return;
      }

    
      const updated = await redis.hgetall(redisKey);

    

    
      io.emit("UPDATE_BID", {
        itemId,
        currentBid: Number(updated.currentBid),
        highestBidderClientId: updated.highestBidderClientId,
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.clientId);
    });
  });
}

module.exports = registerBiddingSocket;