import mongoose from 'mongoose';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new student
// @route   POST /api/register or POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log('[AUTH] Register endpoint reached');
    const { name, email, password, confirmPassword, department } = req.body;
    const finalConfirmPassword = confirmPassword || password;

    // Validation
    if (!name || !email || !password || !department) {
      console.log('[AUTH] Registration failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and department are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log('[AUTH] Registration email received:', normalizedEmail);

    const isConnected = mongoose.connection.readyState === 1;
    console.log('[AUTH] MongoDB connection state for registration:', isConnected ? 'connected' : 'disconnected');

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(normalizedEmail)) {
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

    if (password !== finalConfirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation does not match password',
      });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('[AUTH] Registration conflict: Email already exists:', normalizedEmail);
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
      email: normalizedEmail,
      password,
      role: 'student', // Forced role
      department: department.trim(),
    });

    console.log('[AUTH] User successfully created in MongoDB with ID:', user._id);
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
// @route   POST /api/login or POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log('[AUTH] Login endpoint reached');
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('[AUTH] Login validation failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log(`[AUTH LOOKUP] Normalized target: "${normalizedEmail}" (original length: ${email.length})`);

    const readyState = mongoose.connection.readyState;
    console.log(`[AUTH LOOKUP] MongoDB Connection Verification: readyState=${readyState} (${readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'})`);
    if (readyState !== 1) {
      console.error('[AUTH LOOKUP] ERROR: MongoDB is not connected! Aborting lookup.');
      return res.status(500).json({
        success: false,
        message: 'Database connection offline. Please check MongoDB Atlas.',
      });
    }

    console.log(`[AUTH LOOKUP] Executing query: User.findOne({ email: "${normalizedEmail}" }) on collection 'users'`);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log(`[AUTH LOOKUP] Query Complete: No record found for "${normalizedEmail}" in MongoDB Atlas`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.',
      });
    }

    console.log(`[AUTH LOOKUP] User Found in MongoDB Atlas:`);
    console.log(`  - Role: ${user.role} (${user.role === 'student' ? 'Student Account' : 'Administrator'})`);
    console.log(`  - Name: ${user.name}`);
    console.log(`  - Department: ${user.department || 'N/A'}`);
    console.log(`  - Student/User ID: ${user.userId}`);
    console.log(`  - Database _id: ${user._id}`);

    console.log(`[AUTH LOOKUP] Verifying password hash using bcrypt...`);
    const isMatch = await user.matchPassword(password);
    console.log(`[AUTH LOOKUP] Password verification: ${isMatch ? 'PASSED (matched)' : 'FAILED (mismatch)'}`);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);
    console.log(`[AUTH LOOKUP] Authentication SUCCESS for ${user.email}. JWT issued.`);

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
