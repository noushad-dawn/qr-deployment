const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema({
  companyName: String,
  email: String,
  password: String,
  phoneNumber: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Client', clientSchema);
