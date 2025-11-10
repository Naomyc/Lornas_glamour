const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  serviceSelection: { type: String, required: true },
  supplyOption: {
    type: String,
    enum: ["salon-supplied", "client-supplied"],
    required: false,
  },
  appointmentAt: { type: Date, required: true },
  staffSelection: { type: String },
  customer: {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
  },
  isConfirmed: { type: Boolean, required: false },
  hasDeposit: { type: Boolean, required: false },
  notes: { type: String },
  isRecurring: { type: Boolean },
  onWaitList: { type: Boolean },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
    default: "pending",
  },
  cancellationDate: { type: Date },
  completedDate: { type: Date },   
  noShowDate: { type: Date },     
  confirmationDate: { type: Date }, 
  depositForfeited: { type: Boolean, default: false },
  feeApplied: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
