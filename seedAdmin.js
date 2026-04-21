const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const dotenv = require("dotenv");
dotenv.config();
const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
  });

  const hashedPassword = await bcrypt.hash("secondAdmin123", 10);

  await User.create({
    name: "SecondAdmin",
    email: "admin2@example.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created successfully");
  process.exit();
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
