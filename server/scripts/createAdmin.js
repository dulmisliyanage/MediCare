
const mongoose = require("mongoose");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const Admin = require("../models/Admin");

require("dotenv").config();

async function createAdmin() {
    const rl = readline.createInterface({
        input: stdin,
        output: stdout
    });

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully!");

        // Prevent creating multiple admins through this script
        const existingAdmin = await Admin.exists({});

        if (existingAdmin) {
            console.log("An admin account already exists.");
            return;
        }

        const name = (await rl.question("Admin name: ")).trim();

        const email = (await rl.question("Admin email: "))
            .trim()
            .toLowerCase();

        // Password is entered in the terminal.
        // Use a private terminal because input is visible.
        const password = await rl.question("Admin password: ");

        if (
            name.length < 2 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            password.length < 12
        ) {
            console.log(
                "Invalid details. Use a valid name, email, and password of at least 12 characters."
            );
            return;
        }

        const admin = new Admin({
            name,
            email,
            password
        });

        await admin.save();

        console.log("Admin account created successfully!");

    } catch (error) {
        console.error("Admin setup failed:", error.message);
    } finally {
        rl.close();
        await mongoose.disconnect();
    }
}

createAdmin();
