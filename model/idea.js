// import user from "./user";
const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  name: { type: String, required: [true, "Product / Idea Name is Required."] },
  thumbnail: { type: String, required: [true, "Thumbnail is Required."] },
  description: {
    type: String,
    required: [true, "Description of the Idea is required."],
  },
  investment_percentage: {
    type: Number,
    required: [true, "Type of Investment is required."],
  },
  legal_documentation: {
    type: String,
    required: [true, "Legal Documentation is required."],
  },
  required_investment: {
    type: Number,
    required: [true, "Total Investment is required."],
  },
  video: {
    type: String,
    required: [true, "Video is required."],
  },
  is_approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("idea", ideaSchema);
