const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    return res.status(200).json(newProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: err.message,
    });
  }
};

exports.read = async (req, res) => {
  try {
    let products = await Product.find({});
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};
