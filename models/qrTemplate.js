// models/qrTemplate.js
const mongoose = require('mongoose');

const qrTemplateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fields: [{
    fieldName: {
      type: String,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: Number,
      default: 16
    },
    fontWeight: {
      type: String,
      enum: ['normal', 'bold'],
      default: 'normal'
    },
    color: {
      type: String,
      default: '#000000'
    }
  }],
  qrSize: {
    type: Number,
    default: 180
  },
  backgroundColor: {
    type: String,
    default: '#FFFFFF'
  },
  foregroundColor: {
    type: String,
    default: '#000000'
  },
  padding: {
    type: Number,
    default: 20
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QRTemplate', qrTemplateSchema);