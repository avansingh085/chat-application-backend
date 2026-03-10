const { loginUser, signUpUser } = require("../services/auth.service");
const { verifyToken, destroyToken } = require("../utils/token.util");

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.cookie("ChatsToken", token, {
      httpOnly: true,
      secure: true,      
      sameSite: "none",   
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      id: user._id,
      message: "Login successful"
    });

  } catch (err) {

    res.status(err.status || 500).json({
      success: false,
      message: err.message
    });

  }
};

const signUp = async (req, res) => {
    try {
        const { user } = await signUpUser(req.body);
        res.status(201).json({ success: true, });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

const logout = (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(400).json({ message: "Token is required" });
        destroyToken(token); 
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Logout failed" });
    }
};


const checkToken = (req, res, next) => {
    try {
        const token = req.cookies.ChatsToken;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Invalid token" });
    }
};


module.exports = { login, signUp, logout, checkToken };

