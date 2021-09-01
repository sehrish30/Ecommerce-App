const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.slug);
    const newProduct = await new Product(req.body).save();
    return res.status(200).json(newProduct);
  } catch (err) {
    res.status(500).send("Create product failed");
  }
};
