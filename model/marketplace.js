// import user from "./user";
const mongoose = require("mongoose");

const marketplaceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  market_name: { type: String },
});

module.exports = mongoose.model("marketplace", marketplaceSchema);
