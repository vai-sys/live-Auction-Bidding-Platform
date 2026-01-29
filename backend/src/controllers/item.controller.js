const itemsService = require("../services/item.service.js");

async function getItems(req, res) {
  try {
    const items = await itemsService.getItemsWithCurrentBid();
    res.status(200).json(items);
  } catch (error) {
    console.error("Failed to fetch items:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
}

module.exports = {
  getItems,
};
