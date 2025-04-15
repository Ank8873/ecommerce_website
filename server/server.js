require("dotenv").config();

const express = require("express");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);



app.post('/send-order-email', async (req, res) => {
  const { customerName, customerEmail, items, totalAmount } = req.body;

  // Setup your email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ankittheengineer88@gmail.com',        // Replace with your email
      pass: 'fkfcglkvbdikhgfv',           // Use app-specific password
    },
  });

  // Format item list
  const itemList = items.map(item => `<li>${item.name} - ₹${item.price} x ${item.qty}</li>`).join('');

  // Email to customer
  const mailOptions = {
    from: '"Your Shop" <your-email@gmail.com>',
    to: customerEmail,
    subject: 'Order Confirmation - Your Shop',
    html: `
      <h2>Hi ${customerName},</h2>
      <p>Thank you for your order!</p>
      <h3>Order Details:</h3>
      <ul>${itemList}</ul>
      <p><strong>Total:</strong> ₹${totalAmount}</p>
      <p>We’ll notify you once your order is shipped.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send({ success: true, message: 'Order confirmation email sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Failed to send email' });
  }
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));