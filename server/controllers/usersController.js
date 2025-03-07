const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username createdAt");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllUsers };
