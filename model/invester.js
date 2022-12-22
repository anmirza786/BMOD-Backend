// import user from "./user";
const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  idea: { type: mongoose.Schema.Types.ObjectId, ref: "idea" },
  invested: {
    type: Number,
    required: [true, "Investment is required."],
  },
});

module.exports = mongoose.model("investor", investorSchema);
