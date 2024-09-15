
const { createRazorpayInstance} = require('../config/razorpay.config');
const dotenv = require('dotenv');
const crypto=require('crypto');
const razorpayInstace=createRazorpayInstance();
exports.createOrder = async (req, res) => {

//Do not accept amount from client
const { noOfpeople } = req.body;
//course id se fetch krenge course ka data including its pr
//create an order
const options = {
amount: noOfpeople * 100 * 250, // amount in smallest currency uni
currency: "INR",
receipt: receipt_order_1,

// save data here in database

};

try{
    razorpayInstace.orders.create(options),(err, order) => {
        if(err){
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Oops! Something went wrong :("
            });
        }
        // return the order id to the client
        res.status(200).json(order);
    }
}   
    catch(err) {    
    return res.status(500).json({
        success: false,
        message: "Oops! Something went wrong :("
    });
    }
};

exports.verifyPayment = async (req, res) => {
    console.log("Verify payment !!!");
    const {order_id, payment_id,signature}=req.body;
    const secret=process.env.RAZORPAY_KEY_SECRET;
    const hmac=crypto.createHmac("sha256",secret);
    hmac.update(order_id+"|"+payment_id);
    const generatedSignature=hmac.digest("hex");
    if(signature===generatedSignature){ 
            return res.status(200).json({
                success: true,
                message: "Payment Successful"
            });
        }
            else {
                return res.status(401).json({
                    success: false,
                    message: "Payment Failed"
                });
            }
        }