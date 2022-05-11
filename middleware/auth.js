const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports.authenticate = (req, res, next) => {
  //cookie accessing
  const token = req.cookies.jwt;
  console.log(token);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodes) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decoded);
        next();
      }
    });
  } else {
    res.json("token does not exist");
  }
};
