const Service = require("../models/Service");

// Create new service
exports.createService = async (req, res) => {
  try {
    const serviceData = req.body;
    const newService = new Service(serviceData);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Server Error", error });
    }
  }
};

// Get all services (excluding soft deleted) with category populated
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isDeleted: false })
      .populate({
        path: "category",
        match: { isDeleted: false },
      });

    // Filter out services with null category (category soft deleted)
    const filteredServices = services.filter(service => service.category !== null);

    res.json(filteredServices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
};

// Get service by ID (excluding soft deleted) with category populated
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, isDeleted: false })
      .populate({
        path: "category",
        match: { isDeleted: false },
      });

    if (!service || !service.category) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service", error });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
};

// Soft delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found or already deleted" });
    }
    res.json({ message: "Service soft deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
};
