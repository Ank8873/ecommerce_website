const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  cancelOrder,
  sendShoppingActivity
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.post("/cancel/:orderId", cancelOrder);
router.get("/shopping-summary/:userId", sendShoppingActivity);

module.exports = router;
