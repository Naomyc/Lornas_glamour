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
