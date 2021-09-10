const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

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

// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;
//     // sort = createdAt/updatedAt
//     // order = desc/asc
//     // limit = 3
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     return res.status(200).json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;
    // sort = createdAt/updatedAt
    // order = desc/asc
    // limit = 3
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  return res.status(200).json(total);
};

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();

    const { star } = req.body;
    // who is updating
    // check if user has already rated this project
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet push it
    if (!existingRatingObject) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: {
            ratings: { star, postedBy: user._id },
          },
        },
        { new: true }
      ).exec();
      return res.status(201).json(ratingAdded);
    } else {
      // if rating object matches an object inside rating
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        {
          // this is how we can access and update only star from rating element
          $set: { "ratings.$.star": star },
        },
        { new: true }
      ).exec();
      return res.status(201).json(ratingUpdated);
    }

    // if user has already pushed rating update it
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listRelated = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    // all porducts same category of this except this
    const related = await Product.find({
      _id: {
        $ne: product._id,
      },
      category: product.category,
    })
      .limit(3)
      .populate("category")
      .populate("subs")
      .populate("postedBy")
      .exec();

    return res.json(related);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// SEARCH FILTERS
const handleQuery = async (req, res, query) => {
  // fields like description and title have text=true so this is called text-based search
  const products = await Product.find({
    $text: { $search: query },
  })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  return res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    return res.json(products);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    console.log("HAHAHHAHA", products);
    return res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const handleStars = (req, res, stars) => {
  try {
    // generate a project based on the product document
    // $$ROOT gives you access to entire project document
    // if not $$ROOT shortcut then
    // { title : "$title" , description: "$description"}
    // but this is not practical
    Product.aggregate([
      {
        $project: {
          document: "$$ROOT",
          // title : "$title",
          floorAverage: {
            $floor: {
              $avg: "$ratings.star",
            },
          },
        },
      },
      // match the project and send the json document if its average ratings
      // matche with the rating chosen by user
      { $match: { floorAverage: stars } },
    ])
      .limit(12)
      .exec((err, aggregates) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
        Product.find({ _id: aggregates })
          .populate("category", "_id name")
          .populate("subs", "_id name")
          .populate("postedBy", "_id name")
          .exec((err, products) => {
            if (err) return res.status(500).json(err);
            return res.json(products);
          });
      });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const handleSub = async (req, res, sub) => {
  try {
    const products = await Product.find({ subs: sub })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    return res.json(products);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const { query, price, category, stars, sub } = req.body;

    if (query) {
      console.log("query----->", query);
      await handleQuery(req, res, query);
    }
    // price = [20, 200]
    if (price?.length > 0) {
      console.log("PRICE----->", price);
      await handlePrice(req, res, price);
    }
    if (category) {
      await handleCategory(req, res, category);
    }

    if (stars) {
      console.log("STARS---->", stars);
      await handleStars(req, res, stars);
    }

    if (sub) {
      await handleSub(req, res, sub);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
