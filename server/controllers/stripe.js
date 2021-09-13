const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  // apply coupon
  // calculate price
  console.log(req.body.couponApplied);

  // find user
  const user = await User.findOne({ email: req.user.email }).exec();

  // get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderBy: user._id,
  }).exec();
  console.log("CART TOTAL", cartTotal, totalAfterDiscount);
  // cart total is taken in cents convert it to dollars * 100
  // create payment intent with user amount and currency
  let finalAmount = 0;
  if (req.body.couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "usd",
  });

  return res.status(200).send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
