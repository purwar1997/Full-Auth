const jwt = require("jsonwebtoken");
const { SECRET_KEY: secretKey } = process.env;

// auth is a middleware function
// every middleware has access to req, res and next()
const auth = (req, res, next) => {
  // cookie data can be accessed via req.cookies property
  const { token } = req.cookies;

  // accessing bearer token from the req header
  // inside request header, bearer token will be in the form of key-value pair
  // Authorization: bearer sdfsedffue099877788_+uhjw783621s
  // const token = req.header("Authorization").replace("bearer ", "");

  // checking if the token exists or not
  if (!token) {
    res.status(401).send("Token doesn't exist");
  }

  // verify the token
  try {
    // verify() is used to decode or dcrypt the token using secret key
    // it returns the payload data
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
  } catch (err) {
    res.status(401).send("Invalid token");
  }

  // next() calls the next middleware function in a middleware stack and passes control to it
  next();
};

module.exports = auth;
