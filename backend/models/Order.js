const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: Array,         // List of properties
    totalValue: Number,   // Sum of prices
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);