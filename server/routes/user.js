const express = require("express");
const router = express.Router();

const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  removeFromWishlist,
  wishlist,
  createCashOrder,
} = require("../controllers/user");
const { authCheck } = require("../middlewares/auth");

router.post("/user/cart", authCheck, userCart); // save cart
router.get("/user/orders", authCheck, orders);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, createOrder);
router.post("/user/cash-order", authCheck, createCashOrder);

// wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

// coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

router.get("/user", (req, res) => {
  res.json({
    data: "hey you hit user node API",
  });
});

module.exports = router;
