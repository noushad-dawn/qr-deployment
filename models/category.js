const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  categories: [
    {
      categoryName: String,
      description: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;