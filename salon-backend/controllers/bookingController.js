const Booking = require("../models/Booking");
const mongoose = require("mongoose");


// POST a new booking
exports.createBooking=async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error saving booking:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};

// GET all bookings
exports.getAllBooking=async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// GET booking by ID
exports.getBookingById= async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking.", error });
  }
};

// PUT update booking (general updates)
exports.updateBooking=async (req, res) => {
  try {
    const dataUpdate = req.body;
    const bookingUpdate = await Booking.findByIdAndUpdate(req.params.id, dataUpdate, { new: true });
    if (!bookingUpdate) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(bookingUpdate);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking.", error });
  }
};

// PATCH cancel booking (soft delete)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const now = new Date();
    const appointmentTime = new Date(booking.appointmentAt);
    const diffHours = (appointmentTime - now) / (1000 * 60 * 60);

    // Cancellation policy: free if > 12 hours before appointment
    if (diffHours > 12) {
      // Free cancellation
      booking.status = "cancelled";
      booking.cancellationDate = now;
      booking.depositForfeited = false;
      booking.feeApplied = 0;
    } else {
      // Late cancellation - apply fee or keep deposit
      booking.status = "cancelled";
      booking.cancellationDate = now;
      booking.depositForfeited = booking.hasDeposit; // Forfeit deposit if any
      booking.feeApplied = booking.hasDeposit ? 0 : 1000; // Example fee if no deposit
      // You can customize fee amount as needed
    }

    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking.", error });
  }
};

// PATCH complete booking
exports.completeBooking=async (req, res) => {
  try {
    const completedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
        completedDate: new Date(),
      },
      { new: true }
    );
    if (!completedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.json(completedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error completing booking.", error });
  }
};

// PATCH mark booking as no-show
exports.noShowBooking=async (req, res) => {
  try {
    const noShowBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "no-show",
        noShowDate: new Date(),
      },
      { new: true }
    );
    if (!noShowBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.json(noShowBooking);
  } catch (error) {
    res.status(500).json({ message: "Error marking no-show.", error });
  }
};
// PATCH apply fee or forfeit deposit manually
exports.applyPenalty = async (req, res) => {
  try {
    const { feeAmount, forfeitDeposit } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        ...(feeAmount !== undefined && { feeApplied: feeAmount }),
        ...(forfeitDeposit !== undefined && { depositForfeited: forfeitDeposit }),
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error applying penalty.", error });
  }
};
// GET appointment overview with optional filters
exports.getAppointmentOverview = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    // Build filter object
    let filter = {};

    if (startDate || endDate) {
      filter.appointmentAt = {};
      if (startDate) filter.appointmentAt.$gte = new Date(startDate);
      if (endDate) filter.appointmentAt.$lte = new Date(endDate);
    }

    if (status) {
      // Accept comma-separated statuses: ?status=confirmed,completed
      const statuses = status.split(",");
      filter.status = { $in: statuses };
    }

    // Fetch filtered bookings, sorted by date ascending
    const appointments = await Booking.find(filter)
      .sort({ appointmentAt: 1 })
      .select("serviceSelection staffSelection appointmentAt status customer");

    // Optional: Prepare summary counts by status
    const counts = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      counts,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment overview.", error });
  }
};
