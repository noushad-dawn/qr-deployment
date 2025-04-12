const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },

  productDetails: {
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
  },

  customerDetails: {
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
  },

  user: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },

  processStatus: [
    {
      stepName: String,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  currentStepIndex: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
