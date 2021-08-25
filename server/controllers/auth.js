const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  // User doesn't exist in database we update else we create
  const { name, picture, email } = req.user;

  // updated user email will find user and update the name and picture
  const user = await User.findOneAndUpdate(
    { email },
    { name: name || email.split("@")[0], picture },
    { new: true }
  );

  if (user) {
    console.log("UPDATED ", user);
    res.json(user);
    USER;
  } else {
    const newUser = await new User({
      email,
      name: name || email.split("@")[0],
      picture,
    }).save();
    console.log("USER CREATED", newUser);
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};
