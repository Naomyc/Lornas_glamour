const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const staffController = require("../controllers/staffController");



// Middleware to validate MongoDB ObjectId
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
}


//Router
router.get("/:id/available-dates", validateObjectId, staffController.getStaffAvailableDates);
router.get("/available", staffController.getAvailableStaff);
router.get("/available-times", staffController.getAvailableTimes);
router.post("/", staffController.createStaff);
router.get("/", staffController.getAllStaff);
router.get("/:id", validateObjectId, staffController.getStaffById);
router.put("/:id", validateObjectId, staffController.updateStaff);
router.patch("/:id/active", validateObjectId, staffController.patchStaff);
router.patch("/:id/delete", validateObjectId, staffController.deleteStaff);



module.exports = router;
