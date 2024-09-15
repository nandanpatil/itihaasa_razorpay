const { CreateRazorpayInstance } = require('../config/razorpay.config');
const dotenv = require('dotenv');
const crypto = require('crypto');
const {Order} = require('../models/orders')
const User  = require('../models/user')
// Create Razorpay instance
const razorpayInstance = CreateRazorpayInstance();

// Create order function
exports.createOrder = async (req, res) => {
  try {
    const { name, contact, email } = req.body.prefill;
   const existingUser = await User.findOne({ contact })
   if(!existingUser){
        const newUser = new User({name,contact,email})
        await newUser.save();
   }

    // Create order options
    const options = {
      amount: req.body.numberOfPeople * 250 * 100, // amount in smallest currency unit (paise)
      currency: "INR"
    };

    // Create an order with Razorpay
    const order = await razorpayInstance.orders.create(options);

    // Save the order details in the database here (if needed)

    // Send order details to the client
    return res.status(200).json(order);

  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong :(",
    });
  }
};

// Verify payment function
exports.verifyPayment = async (req, res) => {
  try {
    console.log("Verify payment !!!");
    console.log(req.body)
    const { order_id, payment_id, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Generate HMAC for verification
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(order_id + "|" + payment_id);
    const generatedSignature = hmac.digest("hex");

    // Compare signatures
    if (generatedSignature === signature) {

      return res.status(200).json({
        success: true,
        message: "Payment Successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Payment Failed",
      });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong :(",
    });
  }
};
