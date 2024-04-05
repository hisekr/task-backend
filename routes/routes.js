const express = require("express");
const router = express.Router();
const {
  getUsers,
  getAllUsers,
  getExcelSheet,
  downloadSample,
  readData,
  specificUserDetails,
  updateUserByEmail,
  handleUploadProcess,
  forgotPassword,
} = require("../controllers/controllers");
const verifyToken = require("../middleware/authMiddleware");

const handleFileUpload = require("../controllers/uploadController");

router.get("/users", getUsers);
router.get("/users/:email", verifyToken, getAllUsers);
router.get("/downloadExcel/:email", getExcelSheet);
router.get("/sample", downloadSample);

router.post("/upload", handleFileUpload, handleUploadProcess);
router.put("/forgotPassword", forgotPassword);

module.exports = router;
