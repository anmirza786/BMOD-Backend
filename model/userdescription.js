// import user from "./user";
const mongoose = require("mongoose");

const userdescriptioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  description: { type: String },
});

module.exports = mongoose.model("userdescriptio", userdescriptioSchema);
