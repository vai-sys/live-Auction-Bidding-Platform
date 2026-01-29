const Item = require("../models/Item");
const itemsConfig = require("./items.config");

async function upsertItems() {
  const items = [];

  for (const config of itemsConfig) {
    const auctionEndTime = new Date(
      Date.now() + config.durationMinutes * 60 * 1000
    );

    const item = await Item.findOneAndUpdate(
      { key: config.key },
      {
        title: config.title,
        startingPrice: config.startingPrice,
        auctionEndTime,
        status: "LIVE",
        finalBid: null,
        winnerClientId: null,
      },
      { upsert: true, new: true }
    );

    items.push(item);
  }

  return items;
}

module.exports = upsertItems;
