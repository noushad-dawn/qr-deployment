
const express = require('express');
const router = express.Router();

const Attendance = require('../models/attendance'); 
const Employee = require('../models/user'); // ✅ Same he
const { authenticate } = require('../middleware/auth');

function normalizeDate(inputDate) {
  return new Date(new Date(inputDate).toISOString().split('T')[0]);
}

router.post('/mark', authenticate, async (req, res) => {
  const { date: requestDate, attendanceData } = req.body;
  const tenantId = req.user.clientId;

  if (!requestDate || !attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
    return res.status(400).json({ message: 'Date and attendanceData are required, and attendanceData must be a non-empty array.' });
  }

  const normalizedDate = normalizeDate(requestDate);

  try {
    const existingAttendance = await Attendance.findOne({ clientId: tenantId, date: normalizedDate });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance for this date has already been submitted for this tenant.' });
    }

    const records = [];

    for (const record of attendanceData) {
      const { employeeId, status, leaveType, comments } = record;
      if (!employeeId || !status) continue;

      const employee = await User.findOne({ _id: employeeId, clientId: tenantId });
      if (!employee) continue;

      records.push({
        employeeId,
        status,
        leaveType: ['PaidLeave', 'UnpaidLeave'].includes(status) ? leaveType : null,
        comments: comments || '',
      });
    }

    if (records.length === 0) {
      return res.status(400).json({ message: 'No valid attendance records provided.' });
    }

    const attendance = new Attendance({
      clientId: tenantId,
      date: normalizedDate,
      records
    });

    await attendance.save();

    res.status(201).json({ message: 'Attendance submitted successfully', attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/today', authenticate, async (req, res) => {
  try {
    const tenantId = req.user.clientId;
    const today = normalizeDate(new Date());

    const attendanceRecord = await Attendance.findOne({ clientId: tenantId, date: today })
      .populate('records.employeeId', 'name');

    if (!attendanceRecord) {
      return res.status(404).json({ message: 'No attendance recorded for today.' });
    }

    res.json({ attendance: attendanceRecord.records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:date', authenticate, async (req, res) => {
  try {
    const tenantId = req.user.clientId;
    const { date } = req.params;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

    const normalizedDate = normalizeDate(parsedDate);

    const attendanceRecord = await Attendance.findOne({ clientId: tenantId, date: normalizedDate })
      .populate('records.employeeId', 'name');

    if (!attendanceRecord) {
      return res.status(404).json({ message: `No attendance recorded for ${date}.` });
    }

    res.json({ attendance: attendanceRecord.records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
