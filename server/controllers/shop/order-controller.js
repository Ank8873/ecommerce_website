const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const { sendOrderPlacedEmail, sendOrderCancelledEmail, sendShoppingSummaryEmail } = require("../../utils/emailService");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      type,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId
    } = req.body;
    // console.log(" request body -------------------",req.body);
    // console.log("  ------------------- ------------------- -------------------");
    
    // Detailed validation checks
    const missingFields = [];
    
    if (!userId) missingFields.push('userId');
    if (!cartId) missingFields.push('cartId');
    // console.log(" Cart Item Validation " , cartItems , missingFields);
    if (!Array.isArray(cartItems) || cartItems.length === 0) missingFields.push('cartItems');
    if (!addressInfo) missingFields.push('addressInfo');
    else {
      // Check required address fields
      if (!addressInfo.addressId) missingFields.push('addressInfo.addressId');
      if (!addressInfo.address) missingFields.push('addressInfo.address');
      if (!addressInfo.city) missingFields.push('addressInfo.city');
      if (!addressInfo.pincode) missingFields.push('addressInfo.pincode');
      if (!addressInfo.phone) missingFields.push('addressInfo.phone');
    }
    if (!paymentMethod) missingFields.push('paymentMethod');
    if (!totalAmount && totalAmount !== 0) missingFields.push('totalAmount');
    // console.log(" Cart Item Validation " , cartItems , missingFields);
    // Validate cart items
    if (Array.isArray(cartItems)) {
      cartItems.forEach((item, index) => {
        // Required fields
        if (!item.productId) missingFields.push(`cartItems[${index}].productId`);
        if (!item.title) missingFields.push(`cartItems[${index}].title`);
        if (!item.image) missingFields.push(`cartItems[${index}].image`);
        if (!item.price && item.price !== 0) missingFields.push(`cartItems[${index}].price`);
        if (!item.quantity) missingFields.push(`cartItems[${index}].quantity`);

        // Optional fields with default values
        item.category = item.category || "";
        item.productType = item.productType || "";
        item.type = item.type || "";
        item.size = item.size || "";
        item.measurement = item.measurement || "";
        item.percentageIncrement = typeof item.percentageIncrement === 'number' ? item.percentageIncrement : 0;
      });
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Handle Cash on Delivery
    if (paymentMethod === "cod") {
      // Update product stock
      // console.log(" Cart Item Iteration " , cartItems);
      for (let item of cartItems) {
        let product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.title}`,
          });
        }
        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product: ${item.title}`,
          });
        }
        product.totalStock -= item.quantity;
        await product.save();
      }
      // console.log(" Cart Item Iteration " , cartItems);
      // Create new order
      const orderData = {
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        type,
        totalAmount,
        orderDate,
        orderUpdateDate,
      };

      const order = new Order(orderData);
      const savedOrder = await order.save();

      // Populate user details before sending email
      const populatedOrder = await Order.findById(savedOrder._id)
        .populate('userId', 'userName email');

      // Send order confirmation email
      await sendOrderPlacedEmail(populatedOrder);
          
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Get user's order history
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user"
      });
    }
    
    // Send shopping summary email
    await sendShoppingSummaryEmail(user, orders);

    
      // Clear cart after successful order
      await Cart.findByIdAndDelete(cartId);

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: populatedOrder,
      });
    }

    // Handle PayPal payment
    if (paymentMethod === "paypal") {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
          cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
        },
        transactions: [
          {
            item_list: {
              items: cartItems.map((item) => ({
                name: item.title,
                sku: item.productId,
                price: item.price.toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              })),
            },
            amount: {
              currency: "USD",
              total: totalAmount.toFixed(2),
            },
            description: "Purchase from our store",
          },
        ],
      };

      paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
        if (error) {
          console.error("PayPal payment creation error:", error);
          return res.status(500).json({
            success: false,
            message: "Error while creating paypal payment",
          });
        }

        // Create order with pending status
        const newOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus: "orderPlaced",
          paymentMethod,
          paymentStatus: "pending",
          type: "PAYPAL",
          totalAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
          paymentId: paymentInfo.id,
          payerId: ""
        });

        const savedOrder = await newOrder.save();

        // Populate user details before sending email
        const populatedOrder = await Order.findById(savedOrder._id)
          .populate('userId', 'userName email');

        // Send order confirmation email
        await sendOrderPlacedEmail(populatedOrder);

        // Return the PayPal approval URL
        for (let link of paymentInfo.links) {
          if (link.rel === "approval_url") {
            return res.status(200).json({
              success: true,
              message: "PayPal payment initiated",
              data: {
                order: populatedOrder,
                approvalUrl: link.href
              }
            });
          }
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating order",
      error: error.message
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('userId', 'userName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId, cancellationReason } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    if (!cancellationReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required"
      });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Only allow cancellation if order is in 'orderPlaced' status
    if (order.orderStatus !== 'orderPlaced') {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled in its current status"
      });
    }

    // Restore product quantities
    try {
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.totalStock += item.quantity;
          await product.save();
        }
      }
    } catch (error) {
      console.error("Error restoring product quantities:", error);
      return res.status(500).json({
        success: false,
        message: "Error restoring product quantities",
        error: error.message
      });
    }

    order.orderStatus = 'canceled';
    order.cancellationReason = cancellationReason;
    order.orderUpdateDate = new Date();
    await order.save();

    // Populate user details before sending cancellation email
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'userName email');

    // Send cancellation email
    await sendOrderCancelledEmail(populatedOrder);

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and product quantities restored",
      order: populatedOrder
    });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Add a new function to send shopping summary email
const sendShoppingActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Get user's order history
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user"
      });
    }
    
    // Send shopping summary email
    await sendShoppingSummaryEmail(user, orders);
    
    return res.status(200).json({
      success: true,
      message: "Shopping summary email sent successfully"
    });
  } catch (error) {
    console.error("Error sending shopping summary:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending shopping summary",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  cancelOrder,
  sendShoppingActivity
};
