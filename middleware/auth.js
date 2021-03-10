const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied" });
  }

  // verify the token
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    // console.log(decode);
    req.user = decode.user;
    let { id } = req.user;
    // console.log(`Console from the Middleware, user Details are ${id}`);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not Valid" });
  }
};
