const jwt = require("jsonwebtoken");
const authToken = (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    let verification = null;
    verification = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: verification["id"] };
    req.token = token;
    next();
  } catch (error) {
    res.json({
      msg: "token is not valid",
      code: 12345,
    });
  }
};
module.exports = { authToken };
