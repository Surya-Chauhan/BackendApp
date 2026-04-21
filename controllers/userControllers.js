const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinaryConfig");
exports.postUsers = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const pic = req.file;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }
    let picUrl = "";
    if (pic) {
  try {
    console.log("Uploading to Cloudinary...");

    const uploadResult = await cloudinary.uploader.upload(
      `data:${pic.mimetype};base64,${pic.buffer.toString("base64")}`,
      { folder: "profiles_pics" }
    );

    console.log("Upload success:", uploadResult);

    picUrl = uploadResult.secure_url;

  } catch (err) {
    console.log("🔥 Cloudinary FULL ERROR:", err); // 👈 VERY IMPORTANT
    return res.status(500).json({ error: err.message });
  }
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
  name, 
  email, 
  password: hashedPassword,
  pic: picUrl
});

    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ token, message: "Login successful!" });
  } catch (error) {
    next(error);
  }
};


exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
