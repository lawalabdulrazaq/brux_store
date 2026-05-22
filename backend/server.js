const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Compile the User model directly within your main server file
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'staff'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
}));

// MongoDB Connection Logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas Connected Successfully');
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);
        process.exit(1);
    }
};

connectDB();

// Order Model (Injected here or imported from models folder)
const Order = mongoose.model('Order', new mongoose.Schema({
    items: Array,
    totalValue: Number,
    clientName: String,
    clientEmail: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
}));

// Endpoint 1: Get all customer inquiries
app.get('/api/admin/orders', async (req, res) => {
    try {
        const inquiries = await Order.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customer data" });
    }
});

// Endpoint 2: Get all registered profiles
app.get('/api/admin/users', async (req, res) => {
    try {
        const profiles = await User.find({}, '-password'); // Exclude password hashes for security
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user profiles" });
    }
});

// Endpoint 3: Promote/Modify Roles (Give staff access rights)
app.patch('/api/admin/promote/:id', async (req, res) => {
    try {
        const { targetRole } = req.body; // Expects 'staff' or 'admin'
        await User.findByIdAndUpdate(req.params.id, { role: targetRole });
        res.json({ message: `Access tier successfully adjusted to ${targetRole}` });
    } catch (err) {
        res.status(500).json({ error: "Privilege update operations failed" });
    }
});

// Route: Process New Order
app.post('/api/orders', async (req, res) => {
    try {
        const { items, totalValue } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No properties selected" });
        }

        const newOrder = new Order({ items, totalValue });
        const savedOrder = await newOrder.save();
        
        res.status(201).json({ 
            message: "Inquiry processed successfully", 
            orderId: savedOrder._id 
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during order processing" });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        console.log("📥 Backend received registration request:", req.body);
        const { username, email, password } = req.body;

        // // Validation check
        // if (!username || !email || !password) {
        //     console.log("❌ Missing fields in request payload");
        //     return res.status(400).json({ error: "All fields are required" });
        // }

        // // 2. Hash the password securely
        // console.log("🔑 Hashing password...");

        // Validation Checks
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing required profile parameters. Fill in all fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password requirement failed. It must contain at least 6 characters." });
        }

        // 2. Uniqueness Check: See if email is already in your MongoDB Atlas cluster
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "This email address is already registered. Try logging in or use another email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign Admin role dynamically based on your personal email
        // CHANGED: Setting this to your real email so you get Admin powers automatically!
        const userRole = (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user';
        // console.log(`👤 Assigning role: ${userRole}`);

        // 4. Save to MongoDB
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            role: userRole 
        });

        // console.log("💾 Attempting to save to MongoDB Atlas...");
        // const savedUser = await newUser.save();
        // console.log("✅ User saved successfully in database:", savedUser._id);

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", role: userRole });
    } catch (err) {
        // This prints the exact database error inside your terminal window
        // console.error("❌ CRITICAL BACKEND ERROR DURING REGISTRATION:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'BRUX_ABODE_SUPER_SECRET_KEY';

app.post('/api/auth/login', async (req, res) => {
    try {
        console.log("📥 Backend received login attempt for email:", req.body.email);
        const { email, password } = req.body;

        // 1. Check if user exists in MongoDB Atlas
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ Login failed: Email not found in database");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 2. Validate password encryption using bcrypt match mechanics
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("❌ Login failed: Incorrect password string provided");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. Issue signature payload passing identity and privilege matrix
        console.log(`🔑 Generating signature access token for role: ${user.role}`);
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log(`✅ ${user.username} successfully authenticated!`);
        
        // 4. Send security data profile straight back to your frontend JavaScript handler
        res.status(200).json({
            token,
            role: user.role,
            username: user.username
        });

    } catch (err) {
        console.error("❌ CRITICAL BACKEND ERROR DURING LOGIN OPERATIONS:", err);
        res.status(500).json({ error: "Internal server error during processing profile" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));