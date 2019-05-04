// Dependencies
const cors = require('cors');
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/api/user');

// Config
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// Setup
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/user/', userRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
