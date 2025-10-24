// routes/admin.js
const express = require('express');
const Analysis = require('../models/Analysis');
const User = require('../models/User');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get all analyses
router.get('/analyses', async (req, res) => {
  try {
    const analyses = await Analysis.find()
      .populate('userId', 'email') // <-- this adds the user's email
      .lean();

    res.json(analyses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch analyses' });
  }
});

// Create user
router.post('/users', async (req, res) => {
  const { email, password, name, age, gender, role } = req.body;
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role: role || 'user',
      profile: { name, age, gender }
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  const { email, name, age, gender, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, role, profile: { name, age, gender } },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    await Analysis.deleteMany({ userId: req.params.id }); // Delete associated analyses
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get follow-ups for a user’s analyses
router.get('/followups/:userId', async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.params.userId }).select('prakriti recommendations.followUp');
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add follow-up
router.post('/followups/:analysisId', async (req, res) => {
  try {
    const { followUpText } = req.body;
    if (!followUpText) {
      return res.status(400).json({ message: 'Follow-up text is required' });
    }
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    analysis.recommendations.followUp.push(followUpText);
    await analysis.save();
    res.json(analysis);
  } catch (error) {
    console.error('Error adding follow-up:', error);
    res.status(500).json({ message: 'Error adding follow-up', error: error.message });
  }
});

// Delete follow-up
router.delete('/followups/:analysisId/:index', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    analysis.recommendations.followUp.splice(req.params.index, 1);
    await analysis.save();
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;