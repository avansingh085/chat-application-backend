const { verifyToken} = require("../utils/token.util");
const checkToken = (req, res, next) => {
    try {
       const token = req.headers.authorization;
       
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports=checkToken;