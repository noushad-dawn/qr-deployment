const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://oksoyry:KH%5EBE9p2%22mC22a@cluster0.1fc11zk.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Accept form-data
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/client', require('./routes/authClient'));
app.use('/api/user', require('./routes/authUser'));
app.use('/api/product', require('./routes/product'));
app.use('/api/process', require('./routes/process'));
app.use('/api/category', require('./routes/category')); 
app.use('/api/qrTemplate', require('./routes/qrTemplates'));
app.use('/api/attendance', require('./routes/attendance'));

app.listen(5000, () => console.log('Server running on port 5000'));
