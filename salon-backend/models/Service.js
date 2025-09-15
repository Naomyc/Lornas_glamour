const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  service_name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Updated!
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  service_image: { type: String },
  deposit_required: { type: Boolean, default: false },
  notes: { type: String },
  hair_supply_option: {
    type: String,
    enum: ["salon-supplied", "client-supplied"],
    required: true,
  },isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Service", ServiceSchema);
