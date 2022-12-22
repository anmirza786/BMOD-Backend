const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  profile: { type: String, required: [true, "Profile Picture is required."] },
  cnic: { type: String, required: [true, "CNIC number is required."] },
  phone: { type: String, required: [true, "Phone number is required."] },
  is_entreprenure: { type: Boolean, default: true },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  member_since: {type:Date}
});

module.exports = mongoose.model("user", userSchema);
