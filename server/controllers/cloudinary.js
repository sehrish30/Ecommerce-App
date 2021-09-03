const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// if sending form data access by req.files.file.path

exports.upload = async (req, res) => {
  // image will be in json data
  let result = await cloudinary.uploader.upload(req.body.image, {
    // public id is the name of the image
    public_id: `${Date.now()}`,
    resource_type: "auto",
  });
  return res.status(200).json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};

exports.remove = async (req, res) => {
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (result) => {
    console.log("RESULT", result);
    if (result.result == "ok") {
      return res.send(true);
    } else {
      return res.send(500).send(false);
    }
  });
};
