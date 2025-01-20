const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  getUsers,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/user");

const router = express.Router();

const { protect } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/users", getUsers);
router.get("/me", protect, getMe);
router.put("/me", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
