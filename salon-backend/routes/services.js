const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const serviceController = require("../controllers/serviceController");

// Middleware to validate MongoDB ObjectId
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
}

// Routes
router.post("/", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", validateObjectId, serviceController.getServiceById);
router.put("/:id", validateObjectId, serviceController.updateService);
router.delete("/:id", validateObjectId, serviceController.deleteService);

module.exports = router;
