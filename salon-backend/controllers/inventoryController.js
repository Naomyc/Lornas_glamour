const mongoose= require ("mongoose");
const Inventory=require("../models/Inventory");


// Create new inventory item
exports.createInventoryItem = async (req, res) => {
  try {
    const item = new Inventory(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all inventory items (exclude soft-deleted)
exports.getInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.find({ isDeleted: { $ne: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one inventory item by Id
exports.getInventoryItemById = async (req, res) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    if ('isDeleted' in req.body) delete req.body.isDeleted;

    const updatedItem = await Inventory.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ error: 'Item not found or deleted' });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Soft delete inventory item (flag isDeleted: true)
exports.deleteInventoryItem = async (req, res) => {
  try {
    const deletedItem = await Inventory.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedItem) return res.status(404).json({ error: 'Item not found or already deleted' });
    res.json({ message: 'Item soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
