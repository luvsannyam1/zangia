const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse.js");
const Users = require("../models/Users");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (token.length == 0) {
    return next(
      new ErrorResponse("Not authorized to access this route 1", 401)
    );
  }

  try {
    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Users.findById(decoded.id);

    next();
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
