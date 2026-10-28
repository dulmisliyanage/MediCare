
const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

/* ==========================================
   POST - ADMIN LOGIN
========================================== */

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate login details
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find admin and include password hash
        const admin = await Admin.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        // Avoid revealing whether the email exists
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Verify password
        const isPasswordValid =
            await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                adminId: admin._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
                algorithm: "HS256"
            }
        );

        // Send successful login response
        return res.status(200).json({
            success: true,
            message: "Admin login successful!",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error("Admin login failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to log in. Please try again."
        });
    }
});

module.exports = router;
