const express = require("express");
const {
  createUserDetail,
  getUserDetail,
  updateUserDetail,
  deleteUserDetail,
} = require("../controllers/userDetailController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createUserDetail);
router.get("/", authenticate, getUserDetail);
router.put("/", authenticate, updateUserDetail);
router.delete("/", authenticate, deleteUserDetail);

module.exports = router;
