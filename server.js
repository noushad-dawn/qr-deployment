require('dotenv').config(); // Load env vars locally

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('DB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: true }));

//  Add this route handler
app.get('/', (req, res) => {
  res.send('QR Backend API is running!');
});

// API routes
app.use('/api/client', require('./routes/authClient'));
app.use('/api/user', require('./routes/authUser'));
app.use('/api/product', require('./routes/product'));
app.use('/api/process', require('./routes/process'));
app.use('/api/category', require('./routes/category'));
app.use('/api/qrTemplate', require('./routes/qrTemplates'));
app.use('/api/attendance', require('./routes/attendance'));

// Listen on the port provided by Cloud Run or default to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
