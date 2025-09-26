const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const loginUser = async (email, password) => {
    if (!email || !password) throw { status: 400, message: "Email and Password are required!" };

    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "User not found" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 401, message: "Password is incorrect" };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return { user, token };
};


const signUpUser = async ({ userId, email, password }) => {
    if (!userId || !email || !password) throw { status: 400, message: "All input is required" };

    const existingUser = await User.findOne({ email });
    if (existingUser) throw { status: 400, message: "User already exists" };
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ userId, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    return { user: newUser, token };
};

module.exports = { loginUser, signUpUser };
