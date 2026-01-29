const express = require("express");
const router = express.Router();

const { getItems } = require("../controllers/item.controller.js");

router.get("/items", getItems);
router.get("/server-time", (req, res) => {
  res.json({ serverTime: Date.now() });
});

module.exports = router;