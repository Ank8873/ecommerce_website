const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String, //("male", "female", "kids")
    productType: String , //("round_neck_half", "polo_neck", "round_neck_full", "sweat_shirts_full", "sweat_shirts_upper", "round_neck_oversize", "crop_top")
    type: String, //("size", "age_group")
    size: String ,  // XS, S, M, L, XL, XXL or 3-5yr, 6-8yr, 9-13yr
    measurement: String,  // 36in, 38in, 40in, 442in , 44in , free_size , kids)
    percentageIncrement: Number, // Dynamic percentage value for price increment
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
