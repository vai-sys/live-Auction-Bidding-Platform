


const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    auctionEndTime: {
      type: Date,
      required: true,
  
    },

   
    status: {
      type: String,
      enum: ["LIVE", "ENDED"],
      default: "LIVE",
    
    },

   
    finalBid: {
      type: Number,
      min: 0,
    },

    winnerClientId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
