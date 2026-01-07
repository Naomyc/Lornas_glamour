const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const Service=require("../models/Service");

// POST a new booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const service = await Service.findOne({ service_name: bookingData.serviceSelection });
    if (!service) {
      return res.status(400).json({ message: "Invalid service selected." });
    }
    const serviceDuration = service.duration; // in minutes
    const breakDuration = 15;
    const appointmentStart = new Date(bookingData.appointmentAt);
    const appointmentEnd = new Date(appointmentStart.getTime() + (serviceDuration + breakDuration) * 60000);
    const staffConflict = await Booking.findOne({
      staffSelection: bookingData.staffSelection,
      status: { $in: ["pending", "confirmed", "completed"] },
      appointmentAt: { $lt: appointmentEnd },
      $expr: { $gt: [{ $add: ["$appointmentAt", { $multiply: [serviceDuration, 60000] }] }, appointmentStart] }
    });
    if (staffConflict) {
      return res.status(400).json({ message: "Staff is not available at this time." });
    }

    // 4️⃣ Check customer conflicts
    const customerConflict = await Booking.findOne({
      "customer.email": bookingData.customer.email,
      status: { $in: ["pending", "confirmed", "completed"] },
      appointmentAt: { $lt: appointmentEnd },
      $expr: { $gt: [{ $add: ["$appointmentAt", { $multiply: [serviceDuration, 60000] }] }, appointmentStart] }
    });
    if (customerConflict) {
      return res.status(400).json({ message: "Customer already has a booking at this time." });
    }

    
    const newBooking = new Booking(bookingData);
    
    const savedBooking = await newBooking.save();

    // Log the saved booking
    console.log("✅ Booking saved:", savedBooking);

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "LC Glamour",
            email: "naomybiwotc@gmail.com"
          },
          to: [
            {
              email: savedBooking.customer.email,
              name: savedBooking.customer.name
            }
          ],
          subject: "Your Booking is Confirmed!",
          htmlContent: `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    
    <!-- Header -->
    <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #000;">
      <h2 style="color: #000; margin: 0; font-size: 26px; letter-spacing: 1px;">LC Glamour</h2>
      <p style="color: #C9A86E; margin: 5px 0 0; font-size: 14px;">Luxury Beauty & Hair</p>
    </div>

    <!-- Body -->
    <p style="font-size: 15px; margin-top: 20px;">
      Hi ${savedBooking.customer.name},
    </p>

    <p style="font-size: 15px; line-height: 1.5;">
      Your appointment has been <strong>confirmed</strong> for:<br/>
      <strong>${savedBooking.appointmentAt.toLocaleString()}</strong>
    </p>

    <!-- Location -->
    <p style="font-size: 15px; line-height: 1.5; margin-top: 15px;">
      <strong>Location:</strong><br/>
      LC Glamour<br/>
      Järvensivuntie 13A
    </p>

    <!-- Map Button -->
    <a href="https://www.google.com/maps/search/?api=1&query=Järvensivuntie+13A,+Tampere"
       style="
         display: inline-block;
         margin-top: 10px;
         background: #000;
         color: #C9A86E;
         padding: 10px 18px;
         border-radius: 6px;
         text-decoration: none;
         font-size: 15px;
       "
    >
      View on Google Maps
    </a>

    <!-- Footer -->
    <p style="margin-top: 25px; font-size: 14px; color: #555;">
      Thank you for choosing <strong>LC Glamour</strong>.  
      We look forward to giving you a beautiful experience ✨
    </p>

  </div>
`

        })
      });

      // Log Brevo response
      const data = await response.json();
      console.log("📬 Brevo API response:", data);
      if (!response.ok) {
        console.error("⚠️ Brevo API returned an error:", data);
      }

    } catch (emailErr) {
      console.error("⚠️ Email failed to send:", emailErr);
    }

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
exports.getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// GET booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking.", error });
  }
};

// PUT update booking (general updates)
exports.updateBooking = async (req, res) => {
  try {
    const dataUpdate = req.body;
    const bookingUpdate = await Booking.findByIdAndUpdate(req.params.id, dataUpdate, { new: true });
    if (!bookingUpdate) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(bookingUpdate);
  } catch (error) {
    console.error("Error updating booking:", error);
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

    if (diffHours > 12) {
      booking.status = "cancelled";
      booking.cancellationDate = now;
      booking.depositForfeited = false;
      booking.feeApplied = 0;
    } else {
      booking.status = "cancelled";
      booking.cancellationDate = now;
      booking.depositForfeited = booking.hasDeposit;
      booking.feeApplied = booking.hasDeposit ? 0 : 1000;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking.", error });
  }
};

// PATCH complete booking
exports.completeBooking = async (req, res) => {
  try {
    const completedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "completed", completedDate: new Date() },
      { new: true }
    );
    if (!completedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.json(completedBooking);
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({ message: "Error completing booking.", error });
  }
};

// PATCH mark booking as no-show
exports.noShowBooking = async (req, res) => {
  try {
    const noShowBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "no-show", noShowDate: new Date() },
      { new: true }
    );
    if (!noShowBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.json(noShowBooking);
  } catch (error) {
    console.error("Error marking no-show:", error);
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
    console.error("Error applying penalty:", error);
    res.status(500).json({ message: "Error applying penalty.", error });
  }
};

// GET appointment overview with optional filters
exports.getAppointmentOverview = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    let filter = {};

    if (startDate || endDate) {
      filter.appointmentAt = {};
      if (startDate) filter.appointmentAt.$gte = new Date(startDate);
      if (endDate) filter.appointmentAt.$lte = new Date(endDate);
    }

    if (status) {
      const statuses = status.split(",");
      filter.status = { $in: statuses };
    }

    const appointments = await Booking.find(filter)
      .sort({ appointmentAt: 1 })
      .select("serviceSelection staffSelection appointmentAt status customer");

    const counts = await Booking.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      counts,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointment overview:", error);
    res.status(500).json({ message: "Error fetching appointment overview.", error });
  }
};
