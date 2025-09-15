const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bookingController = require("../controllers/bookingController");


// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
}

//Routes
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBooking);
router.get("/:id", validateObjectId, bookingController.getBookingById);
router.put("/:id", validateObjectId, bookingController.updateBooking);
router.patch("/:id/cancel", validateObjectId, bookingController.cancelBooking);
router.patch("/:id/complete", validateObjectId, bookingController.completeBooking);
router.patch("/:id/noshow", validateObjectId, bookingController.noShowBooking);
router.patch("/:id/penalty", validateObjectId, bookingController.applyPenalty);
router.get("/overview", bookingController.getAppointmentOverview);


module.exports = router;
