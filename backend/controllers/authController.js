import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, department } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !department) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, password, confirm password, department) are required',
      });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation does not match password',
      });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email address already exists',
      });
    }

    // Generate unique student ID (e.g., STU-XXXXXX)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const customUserId = `STU-${Date.now().toString().slice(-4)}${randomDigits}`;

    // STRICT RULE: Public registration ALWAYS creates role = 'student'
    const user = await User.create({
      userId: customUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'student', // Forced role
      department: department.trim(),
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Student registration successful. Please log in.',
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration',
    });
  }
};

// @desc    Authenticate user (student or admin) & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login',
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving user profile',
    });
  }
};
