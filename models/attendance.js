const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    records: [{
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Corrected ref from 'USER' to 'User'
        required: true,
      },
      status: {
        type: String,
        enum: ['Present', 'Absent', 'PaidLeave', 'UnpaidLeave', 'MaternityLeave', 'PaternityLeave'],
        required: true,
      },
      leaveType: {
        type: String,
        enum: ['Sick', 'Vacation', 'Maternity', 'Paternity'],
        default: null,
      },
      comments: {
        type: String,
        default: '',
      },
      _id: false,
    }],
  }, { timestamps: true });
  
  attendanceSchema.index({ clientId: 1, date: 1 }, { unique: true });
  attendanceSchema.index({ 'clientId': 1, 'date': 1, 'records.employeeId': 1 }, { unique: true });
  
  mongoose.model('Attendance', attendanceSchema); // Register model properly