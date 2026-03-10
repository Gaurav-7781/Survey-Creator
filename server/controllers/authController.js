const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

console.log("AUTH CONTROLLER LOADED");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
    try {
        console.log("REGISTER BODY:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const exists = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ username, email: normalizedEmail, password });
        await user.save();

        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        console.log("LOGIN BODY:", req.body);

        const { email, password } = req.body;

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    register,
    login,
    getUser
};

console.log("EXPORTED AUTH METHODS:", module.exports);
