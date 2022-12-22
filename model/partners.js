// import user from "./user";
const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  idea: { type: mongoose.Schema.Types.ObjectId, ref: "idea" },
  name: { type: String, required: [true, "Name is Required."] },
  picture: { type: String, required: [true, "Picture is Required."] },
});

module.exports = mongoose.model("partners", partnerSchema);
