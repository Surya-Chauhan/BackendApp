const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  pic: { 
    type: String, 
    default: "" 
  },
  role: {
    type: String,
    enum: ["employer", "admin", "employee"],
    default: "employee",
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
