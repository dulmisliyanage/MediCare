
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: {
            type: Number,
            required: true
        },

        doctorName: {
            type: String,
            required: true,
            trim: true
        },

        patientName: {
            type: String,
            required: true,
            trim: true
        },

        patientEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        patientPhone: {
            type: String,
            required: true,
            trim: true
        },

        appointmentDate: {
            type: Date,
            required: true
        },

        message: {
            type: String,
            default: "",
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
