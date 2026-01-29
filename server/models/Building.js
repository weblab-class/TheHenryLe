const mongoose = require("mongoose");

const BuildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  direction: { type: String, required: false, default: "" },
  number: { type: Number, required: true },
  questions: {
    q1: { type: Boolean, default: false },
    q2: { type: Boolean, default: false },
    q3: { type: Boolean, default: false },
    q4: { type: Boolean, default: false },
    q5: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("Building", BuildingSchema);
