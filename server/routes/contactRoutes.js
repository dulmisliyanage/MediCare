const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const ContactMessage = require("../models/ContactMessage");

// POST /api/contact
// Receive and save a contact message
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};

        // Validate required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof subject !== "string" ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                message: "Please complete all required fields."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanSubject = subject.trim();
        const cleanMessage = message.trim();

        if (
            !cleanName ||
            !cleanEmail ||
            !cleanSubject ||
            !cleanMessage
        ) {
            return res.status(400).json({
                message: "Please complete all required fields."
            });
        }

        // Check maximum lengths
        if (
            cleanName.length > 100 ||
            cleanEmail.length > 254 ||
            cleanSubject.length > 200 ||
            cleanMessage.length > 5000
        ) {
            return res.status(400).json({
                message: "One or more fields are too long."
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        // Save message to MongoDB
        await ContactMessage.create({
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage
        });

        return res.status(201).json({
            message: "Your message has been sent successfully!"
        });

    } catch (error) {
        console.error("Contact message error:", error);

        return res.status(500).json({
            message: "Unable to send your message. Please try again."
        });
    }
});


// GET /api/contact
// Retrieve all contact messages (admin only)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 });

        return res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching contact messages:", error);

        return res.status(500).json({
            message: "Unable to load contact messages."
        });
    }
});


// ==========================================
// MARK CONTACT MESSAGE AS READ (ADMIN ONLY)
// ==========================================

// PATCH /api/contact/:id/read
router.patch("/:id/read", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid contact message ID."
            });
        }

        const updatedMessage = await ContactMessage.findByIdAndUpdate(
            id,
            { status: "read" },
            { new: true, runValidators: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                message: "Contact message not found."
            });
        }

        return res.status(200).json({
            message: "Contact message marked as read.",
            contactMessage: updatedMessage
        });

    } catch (error) {
        console.error("Error updating contact message:", error);

        return res.status(500).json({
            message: "Unable to update contact message."
        });
    }
});

module.exports = router;
