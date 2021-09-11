const express = require("express");
const router = express.Router();

const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
} = require("../controllers/user");
const { authCheck } = require("../middlewares/auth");

router.post("/user/cart", authCheck, userCart); // save cart
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

router.get("/user", (req, res) => {
  res.json({
    data: "hey you hit user node API",
  });
});

module.exports = router;
