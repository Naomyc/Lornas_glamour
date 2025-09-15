const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const mongoose = require('mongoose');


function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
}

// routes
router.post('/', inventoryController.createInventoryItem);
router.get('/', inventoryController.getInventoryItems);
router.get('/:id',validateObjectId, inventoryController.getInventoryItemById);
router.put('/:id',validateObjectId, inventoryController.updateInventoryItem);
router.patch('/:id/delete',validateObjectId, inventoryController.deleteInventoryItem);

module.exports = router;
