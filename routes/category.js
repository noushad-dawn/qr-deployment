const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const { authenticate } = require("../middleware/auth");

// Create or update categories
router.post("/categories", authenticate, async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Categories are required" });
    }

    // Check if categories already exist for the client
    const existingCategories = await Category.findOne({ clientId: req.user.clientId });
    
    if (existingCategories) {
      // Update existing categories
      existingCategories.categories = categories;
      await existingCategories.save();
      return res.status(200).json({ 
        message: "Categories updated", 
        categories: existingCategories 
      });
    }

    // Create new categories
    const newCategories = new Category({
      clientId: req.user.clientId,
      categories,
    });
    
    await newCategories.save();
    res.status(201).json({ 
      message: "Categories created", 
      categories: newCategories 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get categories
router.get("/categories", authenticate, async (req, res) => {
  try {
    const categories = await Category.findOne({ clientId: req.user.clientId });

    if (!categories) {
      return res.status(200).json({ message: "No categories found" });
    }

    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Delete a specific category by name
router.delete("/categories/:categoryName", authenticate, async (req, res) => {
    try {
      const { categoryName } = req.params;
  
      const categoryDoc = await Category.findOne({ clientId: req.user.clientId });
  
      if (!categoryDoc) {
        return res.status(404).json({ message: "No categories found" });
      }
  
      // Filter out the category to delete
      categoryDoc.categories = categoryDoc.categories.filter(
        (cat) => cat.categoryName !== categoryName
      );
  
      await categoryDoc.save();
      res.status(200).json({ message: "Category deleted", categories: categoryDoc.categories });
    } catch (error) {
      console.error("Delete Category Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
module.exports = router;