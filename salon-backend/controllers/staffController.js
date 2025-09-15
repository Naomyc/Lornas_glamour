const Staff = require("../models/Staff");
const mongoose= require("mongoose");


// Create a new staff member
exports.createStaff = async (req, res) => {
  try {
    const staffData = req.body;

    // Generate staffId
    staffData.staffId = await generateStaffId();

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

// Get all staff members
exports.getAllStaff= async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error });
  }
};

// Get a single staff member by ID
exports.getStaffById=async (req, res) => {
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

// Update a staff member completely (PUT)
exports.updateStaff=async (req, res) => {
  try {
    const updateData = req.body;

    // Prevent staffId changes on update
    if ("staffId" in updateData) {
      delete updateData.staffId;
    }

    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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

// Patch to partially update a staff member (e.g. availability, active status)
exports.patchStaff=async (req, res) => {
  try {
    const updateData = req.body;

    // Prevent staffId changes on patch
    if ("staffId" in updateData) {
      delete updateData.staffId;
    }

    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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

// "Soft delete" — mark staff inactive (e.g. contract ended)
exports.deleteStaff=async (req, res) => {
  try {
    const deactivatedStaff = await Staff.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!deactivatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.json(deactivatedStaff);
  } catch (error) {
    res.status(500).json({ message: "Error deactivating staff", error });
  }
};
