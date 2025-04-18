require('dotenv').config();
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
console.log(transporter);
// Email templates
const getOrderPlacedTemplate = (orderDetails) => {
  return `
    <h2>New Order Placed</h2>
    <div style="margin-bottom: 20px;">
      <h3>Order Information</h3>
      <p><strong>Order ID:</strong> ${orderDetails._id}</p>
      <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleString()}</p>
      <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
      <p><strong>Payment Status:</strong> ${orderDetails.paymentStatus}</p>
      <p><strong>Order Status:</strong> ${orderDetails.orderStatus}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${orderDetails.userId.userName}</p>
      <p><strong>Email:</strong> ${orderDetails.userId.email}</p>
      <p><strong>Phone:</strong> ${orderDetails.addressInfo.phone}</p>
      <p><strong>Shipping Address:</strong></p>
      <p>${orderDetails.addressInfo.address}</p>
      <p>${orderDetails.addressInfo.city} - ${orderDetails.addressInfo.pincode}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>Order Items:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
          <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Details</th>
          <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Price</th>
          <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total</th>
        </tr>
        ${orderDetails.cartItems.map(item => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">
              <strong>${item.title}</strong><br>
              <small>Category: ${item.category}</small>
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
              ${item.size ? `<small>Size: ${item.size}</small><br>` : ''}
              ${item.type ? `<small>Type: ${item.type}</small><br>` : ''}
              ${item.measurement ? `<small>Measurement: ${item.measurement}</small>` : ''}
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.price}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.price * item.quantity}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="4" style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
          <td style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>₹${orderDetails.totalAmount}</strong></td>
        </tr>
      </table>
    </div>
  `;
};

const getOrderCancelledTemplate = (orderDetails) => {
  return `
    <h2>Order Cancelled</h2>
    <div style="margin-bottom: 20px;">
      <h3>Order Information</h3>
      <p><strong>Order ID:</strong> ${orderDetails._id}</p>
      <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleString()}</p>
      <p><strong>Cancellation Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
      <p><strong>Reason for Cancellation:</strong> ${orderDetails.cancellationReason || 'Not specified'}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${orderDetails.userId.userName}</p>
      <p><strong>Email:</strong> ${orderDetails.userId.email}</p>
      <p><strong>Phone:</strong> ${orderDetails.addressInfo.phone}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>Cancelled Items:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
          <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Details</th>
          <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Price</th>
          <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total</th>
        </tr>
        ${orderDetails.cartItems.map(item => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">
              <strong>${item.title}</strong><br>
              <small>Category: ${item.category}</small>
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
              ${item.size ? `<small>Size: ${item.size}</small><br>` : ''}
              ${item.type ? `<small>Type: ${item.type}</small><br>` : ''}
              ${item.measurement ? `<small>Measurement: ${item.measurement}</small>` : ''}
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.price}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.price * item.quantity}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="4" style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
          <td style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>₹${orderDetails.totalAmount}</strong></td>
        </tr>
      </table>
    </div>
  `;
};


// Email sending functions
const sendOrderPlacedEmail = async (orderDetails) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ankittheengineer88@gmail.com',
      subject: `New Order Placed - Order ID: ${orderDetails._id}`,
      html: getOrderPlacedTemplate(orderDetails)
    });
    console.log('Order placed email sent successfully');
  } catch (error) {
    console.error('Error sending order placed email:', error);
  }
};

const sendOrderCancelledEmail = async (orderDetails) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ankittheengineer88@gmail.com',
      subject: `Order Cancelled - Order ID: ${orderDetails._id}`,
      html: getOrderCancelledTemplate(orderDetails)
    });
    console.log('Order cancelled email sent successfully');
  } catch (error) {
    console.error('Error sending order cancelled email:', error);
  }
};

module.exports = {
  sendOrderPlacedEmail,
  sendOrderCancelledEmail
};
