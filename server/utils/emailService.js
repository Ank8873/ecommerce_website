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

// Account creation email template
const getAccountCreationTemplate = (user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #333; text-align: center;">Welcome to Ankit Vastraa!</h2>
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>Thank you for creating an account with us! Your account has been successfully created and is now active.</p>
        <p>Here are your account details:</p>
        <ul>
          <li><strong>Name:</strong> ${user.userName}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Account Created:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
      </div>
      <div style="margin-bottom: 20px;">
        <p>You can now:</p>
        <ul>
          <li>Browse our collection of clothing and accessories</li>
          <li>Add items to your cart</li>
          <li>Save your shipping addresses</li>
          <li>Track your orders</li>
          <li>And much more!</li>
        </ul>
      </div>
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Happy shopping!</p>
      </div>
    </div>
  `;
};

// Shopping summary email template
const getShoppingSummaryTemplate = (userData, orderHistory) => {
  const totalSpent = orderHistory.reduce((sum, order) => sum + order.totalAmount, 0);
  const mostOrderedCategories = getMostOrderedCategories(orderHistory);
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #333; text-align: center;">Your Shopping Summary</h2>
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
        <p>Hello <strong>${userData.userName}</strong>,</p>
        <p>Here's a summary of your shopping activity with Ankit Vastraa:</p>
        
        <div style="margin: 15px 0;">
          <h3 style="color: #555;">Account Overview</h3>
          <ul>
            <li><strong>Total Orders:</strong> ${orderHistory.length}</li>
            <li><strong>Total Spent:</strong> ₹${totalSpent.toFixed(2)}</li>
            <li><strong>Member Since:</strong> ${new Date(userData.createdAt || Date.now()).toLocaleDateString()}</li>
          </ul>
        </div>
        
        <div style="margin: 15px 0;">
          <h3 style="color: #555;">Your Shopping Preferences</h3>
          <p>Based on your orders, you seem to prefer:</p>
          <ul>
            ${mostOrderedCategories.map(category => `<li>${category.name} (${category.count} items)</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #555;">Recent Orders</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Order ID</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Date</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Amount</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Status</th>
          </tr>
          ${orderHistory.slice(0, 5).map(order => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${order._id.toString().substring(0, 8)}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date(order.orderDate).toLocaleDateString()}</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${order.totalAmount.toFixed(2)}</td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                <span style="padding: 3px 6px; border-radius: 3px; font-size: 12px; 
                  background-color: ${getStatusColor(order.orderStatus)}; color: white;">
                  ${order.orderStatus}
                </span>
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>Thank you for shopping with Ankit Vastraa!</p>
        <p>Visit our store again for the latest clothing and accessories.</p>
      </div>
    </div>
  `;
};

// Helper function to get color for order status
function getStatusColor(status) {
  switch (status) {
    case 'orderPlaced': return '#3498db';
    case 'confirmed': return '#2ecc71';
    case 'delivered': return '#27ae60';
    case 'canceled': return '#e74c3c';
    default: return '#95a5a6';
  }
}

// Helper function to analyze most ordered categories
function getMostOrderedCategories(orders) {
  const categoryCounts = {};
  
  orders.forEach(order => {
    order.cartItems.forEach(item => {
      if (!categoryCounts[item.category]) {
        categoryCounts[item.category] = 0;
      }
      categoryCounts[item.category] += item.quantity;
    });
  });
  
  // Convert to array and sort
  const categories = Object.keys(categoryCounts).map(name => ({
    name,
    count: categoryCounts[name]
  })).sort((a, b) => b.count - a.count);
  
  return categories.slice(0, 3); // Return top 3 categories
}

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

// New function for account creation email
const sendAccountCreationEmail = async (userData) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userData.email,
      subject: 'Welcome to Ankit Vastraa - Account Created Successfully',
      html: getAccountCreationTemplate(userData)
    });
    console.log('Account creation email sent successfully');
  } catch (error) {
    console.error('Error sending account creation email:', error);
  }
};

// New function for shopping summary email
const sendShoppingSummaryEmail = async (userData, orderHistory) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userData.email,
      subject: 'Your Shopping Summary at Ankit Vastraa',
      html: getShoppingSummaryTemplate(userData, orderHistory)
    });
    console.log('Shopping summary email sent successfully');
  } catch (error) {
    console.error('Error sending shopping summary email:', error);
  }
};

module.exports = {
  sendOrderPlacedEmail,
  sendOrderCancelledEmail,
  sendAccountCreationEmail,
  sendShoppingSummaryEmail
};
