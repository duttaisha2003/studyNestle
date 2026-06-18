

const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const admin = require("../models/admin");
const StudyMaterial = require("../models/studyMaterials");
const { cloudinary } = require("../utils/cloudinary"); // import your cloudinary config

const app = express();
app.use(cookieParser());


const loginAdmin = async (req, res) => {
  try {
    const people = await admin.findOne({ emailId: req.body.emailId });
    if (!people) throw new Error("Invalid Credentials");

    const isAllowed = await bcrypt.compare(req.body.password, people.password);
    if (!isAllowed) throw new Error("Invalid Credentials");

    // ✅ no role field
    const token = jwt.sign(
      { id: people._id, emailId: people.emailId },
      process.env.JWT_KEY,
      { expiresIn: "10h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    res.status(200).json({
      success: true,
      message: "Login Successful",
      admin: { id: people._id, emailId: people.emailId, name: people.adminName },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin Logout
const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch pending materials
const pendingMaterial = async (req, res) => {
  try {
    const pendingMaterials = await StudyMaterial.find({ isApprove: false })
      
     return res.status(200).json({
      success: true,
      count: pendingMaterials.length,
      data: pendingMaterials
    });
  } catch (error) {
    console.error("Error fetching pending materials:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve material
const acceptMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { isApprove: true },
      { new: true }
    );
    res.json({ message: "File approved", material });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject/Delete material
const rejectMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    if (material.publicId) {
      await cloudinary.uploader.destroy(material.publicId);
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: "File rejected and deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  pendingMaterial,
  acceptMaterial,
  rejectMaterial,
};
