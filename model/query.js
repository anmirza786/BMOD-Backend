// import user from "./user";
const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  name: { type: String },
  email: { type: String },
  query: {
    type: String,
  },
});

module.exports = mongoose.model("query", querySchema);
