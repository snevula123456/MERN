const mongoose = require("mongoose");

const TestingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = Testing = mongoose.model("testing", TestingSchema);
