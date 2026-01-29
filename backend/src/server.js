const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = require("./app");
const env = require("./config/env");
const upsertItems = require("./seed/upsertItems");
const redis = require("./config/redis");
const registerBiddingSocket = require("./sockets/bid.socket");
const startAuctionFinalizer = require("./services/auctionFinalizer.service");

async function startServer() {
  try {
    await mongoose.connect(env.MONGO_URI);
  

    const items = await upsertItems();
   

   
    if (process.env.NODE_ENV !== "production") {
      for (const item of items) {
        const redisKey = `auction:${item._id}`;

     
        await redis.del(redisKey);

        await redis.hset(redisKey, {
          currentBid: item.startingPrice,
          highestBidderClientId: "",
          auctionEndTime: Math.floor(
            new Date(item.auctionEndTime).getTime() / 1000
          ),
          ended: "false",
          persisted: "false",
        });
      }

     
    } else {
     
      for (const item of items) {
        const redisKey = `auction:${item._id}`;
        const exists = await redis.exists(redisKey);

        if (!exists) {
          await redis.hset(redisKey, {
            currentBid: item.startingPrice,
            highestBidderClientId: "",
            auctionEndTime: Math.floor(
              new Date(item.auctionEndTime).getTime() / 1000
            ),
            ended: "false",
            persisted: "false",
          });
        }
      }

     
    }

    startAuctionFinalizer();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: "*" },
    });

    io.use((socket, next) => {
      const { clientId } = socket.handshake.auth;
      if (!clientId) return next(new Error("clientId required"));
      socket.clientId = clientId;
      next();
    });

    registerBiddingSocket(io);

    server.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

startServer();
