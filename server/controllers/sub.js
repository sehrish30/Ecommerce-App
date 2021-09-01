const Sub = require("../models/sub");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const sub = await new Sub({
      name,
      parent,
      slug: slugify(name, {
        lower: true,
        trim: true,
        replacement: "-",
      }),
    }).save();

    return res.status(201).json(sub);
  } catch (err) {
    // 11000 is duplicate key error
    if (err.code === 11000) {
      return res.status(500).send("Sub name should be unique");
    }
    return res.status(500).send(err.errors.name.message);
  }
};

exports.list = async (req, res) => {
  try {
    const sub = await Sub.find({})
      .sort({
        createdAt: -1,
      })
      .exec();
    return res.status(200).json(sub);
  } catch (err) {
    return res.status(400).json(err);
  }
};
exports.read = async (req, res) => {
  try {
    let sub = await Sub.findOne({ slug: req.params.slug }).exec();
    return res.status(200).send(sub);
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        parent,
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
    await Sub.findOneAndDelete({ slug: req.params.slug });
    res.status(200).send();
  } catch (err) {
    return res.status(500).send(err);
  }
};
