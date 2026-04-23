const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/items - Add item (protected)
router.post("/", authMiddleware, async (req, res) => {
  const { itemName, description, type, location, date, contactInfo } = req.body;

  try {
    const item = new Item({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      postedBy: req.user.id,
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items - View all items (protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find().populate("postedBy", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items/search?name=xyz - Search items by name or category
router.get("/search", authMiddleware, async (req, res) => {
  const { name } = req.query;

  try {
    const items = await Item.find({
      $or: [
        { itemName: { $regex: name, $options: "i" } },
        { type: { $regex: name, $options: "i" } },
      ],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items/:id - View item by ID (protected)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/items/:id - Update item (protected, only owner)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Only the owner can update
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/items/:id - Delete item (protected, only owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Only the owner can delete
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
