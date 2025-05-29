require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('QR Backend API is running!');
});

app.use('/api/client', require('./routes/authClient'));
app.use('/api/user', require('./routes/authUser'));
app.use('/api/product', require('./routes/product'));
app.use('/api/process', require('./routes/process'));
app.use('/api/category', require('./routes/category'));
app.use('/api/qrTemplate', require('./routes/qrTemplates'));
app.use('/api/attendance', require('./routes/attendance'));

// Start server only after DB connects
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
