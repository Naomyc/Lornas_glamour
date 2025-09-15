const Category = require('../models/Category');

// Get all categories (exclude soft-deleted)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get category by ID (exclude if soft deleted)
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, isDeleted: false });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, imageUrl, description } = req.body;
    const category = new Category({ name, imageUrl, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// Update category (only if not soft deleted)
exports.updateCategory = async (req, res) => {
  try {
    const { name, imageUrl, description } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, imageUrl, description },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found or deleted' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// Soft delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found or already deleted' });
    res.json({ message: 'Category soft deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
