const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  salary: Number,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Job", jobSchema);
