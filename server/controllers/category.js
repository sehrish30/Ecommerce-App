const Category = require("../models/category");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name, {
        lower: true,
        trim: true,
        replacement: "-",
      }),
    }).save();

    return res.status(201).json(category);
  } catch (err) {
    // 11000 is duplicate key error
    if (err.code === 11000) {
      return res.status(500).send("Category name should be unique");
      // return res.status(500).send("Category name should be unique");
    }
    return res.status(500).send(err.errors.name.message);
    // .json({ error: err, message: err.errors.name.message });
  }
};

exports.list = async (req, res) => {
  try {
    const category = await Category.find({})
      .sort({
        createdAt: -1,
      })
      .exec();
    return res.status(200).json(category);
  } catch (err) {
    return res.status(400).json(err);
  }
};
exports.read = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    return res.status(200).send(category);
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        slug: slugify(name, {
          lower: true,
          trim: true,
          replacement: "-",
        }),
      },
      { new: true }
    );
    console.log("ALUMDULLILAH", name);
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.remove = async (req, res) => {
  try {
    await Category.findOneAndDelete({ slug: req.params.slug });
    res.status(200).send();
  } catch (err) {
    return res.status(500).send(err);
  }
};
