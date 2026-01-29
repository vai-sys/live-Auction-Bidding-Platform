const express = require("express");
const cors = require("cors");
const itemRoutes=require("./routes/item.routes")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",itemRoutes);

module.exports = app;
