const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/products");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    // later apply coupon
    // later calculate price
  
    // 1 find user
    const user = await User.findOne({ email: req.user.email }).exec();
    // 2 get user cart total
    const { cartTotal } = await Cart.findOne({ orderdBy: user._id }).exec();
  
    console.log("CART TOTAL CHARGED", cartTotal);
    // create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartTotal * 100,
      currency: "eur",
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  };
  