const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors())
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected')).catch(err => console.log(err));

//should also accept form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/client', require('./routes/authClient'));
app.use('/api/user', require('./routes/authUser'));
app.use('/api/product', require('./routes/product'));
app.use('/api/process', require('./routes/process'));
app.use('/api/category', require('./routes/category')); 
app.listen(5000, () => console.log('Server running on port 5000'));
 