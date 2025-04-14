const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  category: String,
  productType: String,
  type: String,
  size: String,
  measurement: String,
  percentageIncrement: Number
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  cartItems: [CartItemSchema],
  addressInfo: {
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    notes: String,
  },
  orderStatus: {
    type: String,
    enum: ['orderPlaced', 'inShipping', 'delivered', 'rejected', 'canceled'],
    default: 'orderPlaced',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod'],
    default: 'cod',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  orderUpdateDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  type: String,
  paymentId: String,
  payerId: String
}, { timestamps: true });

OrderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus')) {
    this.orderUpdateDate = new Date();
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
