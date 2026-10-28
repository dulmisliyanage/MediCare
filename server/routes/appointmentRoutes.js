const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

/* ==========================================
   POST - CREATE APPOINTMENT
========================================== */

router.post("/", async (req, res) => {
    try {
        const {
            doctorId,
            doctorName,
            patientName,
            patientEmail,
            patientPhone,
            appointmentDate,
            message
        } = req.body;

        // 1. Validate required fields
        if (
            !Number.isInteger(doctorId) ||
            doctorId <= 0 ||
            typeof doctorName !== "string" ||
            typeof patientName !== "string" ||
            typeof patientEmail !== "string" ||
            typeof patientPhone !== "string" ||
            typeof appointmentDate !== "string" ||
            !doctorName.trim() ||
            !patientName.trim() ||
            !patientEmail.trim() ||
            !patientPhone.trim() ||
            !appointmentDate.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid required fields."
            });
        }

        // 2. Validate patient name
        if (patientName.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Patient name must contain at least 2 characters."
            });
        }

        // 3. Validate email address
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(patientEmail.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // 4. Validate Sri Lankan phone number
        const phonePattern = /^(?:0\d{9}|\+94\d{9})$/;

        const cleanedPhone = patientPhone.replace(/[\s-]/g, "");

        if (!phonePattern.test(cleanedPhone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid Sri Lankan phone number."
            });
        }

        // 5. Validate appointment date format
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (!datePattern.test(appointmentDate)) {
            return res.status(400).json({
                success: false,
                message: "Appointment date must use YYYY-MM-DD format."
            });
        }

        // Check whether the date actually exists
        const parsedDate = new Date(
            `${appointmentDate}T00:00:00Z`
        );

        if (
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== appointmentDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid appointment date."
            });
        }

        // 6. Prevent appointments in the past
        const today = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Colombo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date());

        if (appointmentDate < today) {
            return res.status(400).json({
                success: false,
                message: "Appointment date cannot be in the past."
            });
        }

        // 7. Validate optional message
        if (
            message !== undefined &&
            (typeof message !== "string" || message.length > 1000)
        ) {
            return res.status(400).json({
                success: false,
                message: "Message must be text with at most 1000 characters."
            });
        }

        // 8. Create appointment
        const appointment = new Appointment({
            doctorId: doctorId,
            doctorName: doctorName.trim(),
            patientName: patientName.trim(),
            patientEmail: patientEmail.trim().toLowerCase(),
            patientPhone: cleanedPhone,
            appointmentDate: appointmentDate,
            message: message ? message.trim() : ""
        });

        // 9. Save appointment to MongoDB
        await appointment.save();

        // 10. Send success response
        return res.status(201).json({
            success: true,
            message: "Appointment request submitted successfully!",
            appointment: appointment
        });

    } catch (error) {
        console.error("Appointment creation failed:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment details."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to submit appointment request."
        });
    }
});




/* ==========================================
   GET - ALL APPOINTMENTS
   ADMIN ONLY
========================================== */

router.get("/", protectAdmin, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });

    } catch (error) {
        console.error(
            "Failed to fetch appointments:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve appointments."
        });
    }
});


/* ==========================================
   PATCH - UPDATE APPOINTMENT STATUS
   ADMIN ONLY
========================================== */

router.patch("/:id/status", protectAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate appointment ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID."
            });
        }

        // Validate status
        const allowedStatuses = [
            "pending",
            "confirmed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment status."
            });
        }

        // Find appointment and update status
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment status updated successfully!",
            appointment
        });

    } catch (error) {
        console.error(
            "Failed to update appointment status:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to update appointment status."
        });
    }
});




module.exports = router;
