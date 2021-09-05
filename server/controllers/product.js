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

exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    return res.send(true);
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subs")
      .exec();
    return res.json(product);
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    return res.status(200).json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR", err);
    return res.status(500).json({
      err: err.message,
    });
  }
};
