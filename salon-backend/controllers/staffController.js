const Staff = require("../models/Staff");

// Generate random staff ID
const generateStaffId = () => Math.floor(1000 + Math.random() * 9000).toString();

// Create a new staff member
exports.createStaff = async (req, res) => {
  try {
    const staffData = req.body;
    staffData.staffId = generateStaffId();

    const newStaff = new Staff(staffData);
    const savedStaff = await newStaff.save();

    res.status(201).json(savedStaff);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Server Error", error });
    }
  }
};

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error });
  }
};

// Get one staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error });
  }
};

// Full update
exports.updateStaff = async (req, res) => {
  try {
    const updateData = req.body;
    if ("staffId" in updateData) delete updateData.staffId;

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json(updatedStaff);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating staff", error });
    }
  }
};

// Partial update (patch)
exports.patchStaff = async (req, res) => {
  try {
    const updateData = req.body;
    if ("staffId" in updateData) delete updateData.staffId;

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json(updatedStaff);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error patching staff", error });
    }
  }
};

// "Soft delete" - set active: false
exports.deleteStaff = async (req, res) => {
  try {
    const deactivated = await Staff.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!deactivated) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json(deactivated);
  } catch (error) {
    res.status(500).json({ message: "Error deactivating staff", error });
  }
};

// ✅ Get available staff for a given date (with availability filtering)
exports.getAvailableStaff = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "A valid date is required" });
    }

    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

    const allStaff = await Staff.find({ active: true });

    const availableStaff = allStaff.filter((staff) => {
      const { availability } = staff;

      // 1. Check if they work on this day
      const worksToday = availability?.workingDays?.some(
        (d) => d.day.toLowerCase() === dayName.toLowerCase()
      );

      if (!worksToday) return false;

      // 2. Check if the day is in their daysOff
      const isDayOff = availability?.daysOff?.some(
        (offDate) => new Date(offDate).toDateString() === selectedDate.toDateString()
      );

      if (isDayOff) return false;

      // 3. Check if they are on leave during this date
      const isOnLeave = availability?.leaves?.some((leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        return selectedDate >= start && selectedDate <= end;
      });

      if (isOnLeave) return false;

      return true;
    });

    res.json(availableStaff);
  } catch (error) {
    console.error("Error in getAvailableStaff:", error);
    res.status(500).json({ message: "Error checking availability", error });
  }
};
// Get available dates for a specific staff member
exports.getStaffAvailableDates = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff || !staff.active) {
      return res.status(404).json({ message: "Staff member not found or inactive" });
    }

    // Example: generate next 30 days and filter by availability
    const availableDates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      // Check workingDays
      const worksToday = staff.availability?.workingDays?.some(
        (d) => d.day.toLowerCase() === dayName.toLowerCase()
      );
      if (!worksToday) continue;

      // Check daysOff
      const isDayOff = staff.availability?.daysOff?.some(
        (offDate) => new Date(offDate).toDateString() === date.toDateString()
      );
      if (isDayOff) continue;

      // Check leaves
      const isOnLeave = staff.availability?.leaves?.some((leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        return date >= start && date <= end;
      });
      if (isOnLeave) continue;

      availableDates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD
    }

    res.json(availableDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching available dates", error });
  }
};
// Get available time slots for a given date (and optional staffId)
exports.getAvailableTimes = async (req, res) => {
  try {
    const { date, staffId } = req.query;

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "A valid date is required" });
    }

    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

    let staffList = [];

    if (staffId) {
      // Single staff
      const staff = await Staff.findById(staffId);
      if (!staff || !staff.active) {
        return res.status(404).json({ message: "Staff not found or inactive" });
      }
      staffList = [staff];
    } else {
      // All active staff
      staffList = await Staff.find({ active: true });
    }

    // Filter staff who actually work that day
    staffList = staffList.filter((staff) => {
      const worksToday = staff.availability?.workingDays?.some(
        (d) => d.day.toLowerCase() === dayName.toLowerCase()
      );

      if (!worksToday) return false;

      const isDayOff = staff.availability?.daysOff?.some(
        (offDate) => new Date(offDate).toDateString() === selectedDate.toDateString()
      );
      if (isDayOff) return false;

      const isOnLeave = staff.availability?.leaves?.some(
        (leave) =>
          selectedDate >= new Date(leave.startDate) &&
          selectedDate <= new Date(leave.endDate)
      );
      if (isOnLeave) return false;

      return true;
    });

    // Collect time slots
    let availableSlots = [];

    staffList.forEach((staff) => {
      staff.availability.workingDays
        .filter((d) => d.day.toLowerCase() === dayName.toLowerCase())
        .forEach((shift) => {
          // Assume shift.start and shift.end are strings like "10:00", "14:30"
          const [startH, startM] = shift.start.split(":").map(Number);
          const [endH, endM] = shift.end.split(":").map(Number);

          let current = new Date(selectedDate);
          current.setHours(startH, startM, 0, 0);

          const endTime = new Date(selectedDate);
          endTime.setHours(endH, endM, 0, 0);

          while (current < endTime) {
            availableSlots.push(current.toISOString());
            // 30 min intervals
            current = new Date(current.getTime() + 30 * 60000);
          }
        });
    });

    // Remove duplicates and sort
    availableSlots = [...new Set(availableSlots)].sort();

    res.json({ date, availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching available times", error });
  }
};

