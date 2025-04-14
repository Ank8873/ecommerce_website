const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        category: {
          type: String,
          required: true,
        },
        productType: {
          type: String,
          required: true,
        },
        type: {
          type: String,
        },
        size: {
          type: String,
        },
        measurement: {
          type: String,
        },
        percentageIncrement: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);