const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
    customerName: { type: String, default: "Luxury Client" },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
}));

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
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Admin check
        const userRole = (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user';

        const newUser = new UserActivation({
            username,
            email,
            password: hashedPassword,
            role: userRole
        });
        await newUser.save();
        res.status(201).json({ message: "User registered as" + userRole });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));