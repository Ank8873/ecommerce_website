const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category, age, productType, sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category && category.length > 0) {
      // Use lowercase category consistently
      filters.category = category.toLowerCase();
    }

    if (age && age.length > 0) {
      filters.size = age;
    }

    if (productType && productType.length > 0) {
      filters.productType = productType;
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      case "popularity":
        sort.averageReview = -1; // Sort by highest review first
        break;
      case "newest-first":
        sort.createdAt = -1; // Sort by newest products first
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
