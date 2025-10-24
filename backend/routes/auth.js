// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Analysis = require('../models/Analysis'); // <--- ADD THIS IMPORT
const { auth } = require('../middleware/authMiddleware'); // Assuming this exists
const router = express.Router();

// Helper function to consolidate user data response
const getUserResponseData = async (user) => {
  // Fetch the latest analysis for the user
  const latestAnalysis = await Analysis.findOne({ userId: user._id })
    .sort({ createdAt: -1 })
    .select('prakriti'); // Only select the prakriti object

  return {
    id: user._id,
    email: user.email,
    name: user.profile.name,
    age: user.profile.age,
    gender: user.profile.gender,
    // Determine role based on email if not explicitly set, or use stored role
    role: user.role || (user.email === 'admin@example.com' ? 'admin' : 'user'),
    prakriti: latestAnalysis ? latestAnalysis.prakriti : null, // <--- NEW FIELD
  };
};


router.post('/register', async (req, res) => {
  const { email, password, name, age, gender } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const userRole = email === 'admin@example.com' ? 'admin' : 'user';

    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role: userRole,
      profile: { name, age, gender },
    });

    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Use helper function
    const userData = await getUserResponseData(user);

    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? { id: user._id, email: user.email, profile: user.profile } : null);
    if (!user) return res.status(400).json({ message: 'Invalid credentials: User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch, 'Provided password:', password, 'Stored hash:', user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials: Password mismatch' });
    
    // Ensure the token includes the role for middleware checks
    const userRole = user.role || (user.email === 'admin@example.com' ? 'admin' : 'user');
    const token = jwt.sign({ id: user._id, email: user.email, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Use helper function
    const userData = await getUserResponseData(user);

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ message: error.message });
  }
});

// NEW ROUTE: Fetch current user and latest Dosha for re-sync
router.get('/current-user', auth, async (req, res) => {
  try {
    // Find user by ID from the token, excluding the password field
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Use helper function
    const userData = await getUserResponseData(user);

    res.json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Update profile route (optional but good for consistency)
router.put('/update-profile', auth, async (req, res) => {
  const { name, age, gender } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update profile fields
    user.profile.name = name;
    user.profile.age = age;
    user.profile.gender = gender;
    await user.save();

    // Use helper function to get updated user data with latest Dosha
    const userData = await getUserResponseData(user);

    res.json({
      message: 'Profile updated successfully',
      user: userData,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;