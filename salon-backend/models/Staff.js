const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  staffId: { type: String, unique: true },      
  name: { type: String, required: true },
  contact: {
    phone: { type: String },
    email: { type: String }
  },
  specialties: { type: [String], default: [] },
  availability: {
  workingDays: [{
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true }
  }],
  daysOff: [{ type: Date }],
  leaves: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ["paid vacation", "paid sick", "unpaid leave"],
      required: true
    },
    notes: { type: String }
  }]
},

  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Staff", StaffSchema);
