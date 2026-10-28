
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Verify administrator JWT token
const protectAdmin = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        // Check Authorization header
        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Admin authentication required."
            });
        }

        // Extract token
        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing."
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        // Verify token signature and expiration
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        // Check that the admin still exists
        const admin = await Admin.findById(decoded.adminId)
            .select("_id name email");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Administrator account not found."
            });
        }

        // Make authenticated admin available to routes
        req.admin = admin;

        next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token."
            });
        }

        console.error("Authentication error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Authentication service unavailable."
        });
    }
};

module.exports = protectAdmin;
