import Activity from '../models/Activity.js';
import Verification from '../models/Verification.js';
import User from '../models/User.js';

// @desc    Get activities (Student: own activities, Admin: all activities with filters)
// @route   GET /api/activities
// @access  Private (Student & Admin)
export const getActivities = async (req, res) => {
  try {
    const isStudent = req.user.role === 'student';
    let filter = {};

    if (isStudent) {
      // Student only sees their own activities
      filter.studentId = req.user._id;

      const { search, category, status } = req.query;
      if (category && category !== 'All') {
        filter.activityCategory = category;
      }
      if (status && status !== 'All') {
        filter.verificationStatus = status;
      }
      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { activityTitle: regex },
          { eventName: regex },
          { organizer: regex },
          { activityCategory: regex },
          { activityId: regex },
        ];
      }
    } else {
      // Admin can filter by search, category, status, department, and studentId
      const { search, category, status, department, studentId } = req.query;

      if (studentId) {
        if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
          filter.studentId = studentId;
        } else {
          const matchedStudent = await User.findOne({ userId: studentId }).select('_id');
          if (matchedStudent) {
            filter.studentId = matchedStudent._id;
          }
        }
      }

      if (category && category !== 'All') {
        filter.activityCategory = category;
      }

      if (status && status !== 'All') {
        filter.verificationStatus = status;
      }

      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        // Find matching students first if search matches student name/email
        const matchingStudents = await User.find({
          role: 'student',
          $or: [{ name: regex }, { email: regex }, { department: regex }, { userId: regex }],
        }).select('_id');

        const studentIds = matchingStudents.map((s) => s._id);

        filter.$or = [
          { activityTitle: regex },
          { eventName: regex },
          { organizer: regex },
          { activityCategory: regex },
          { activityId: regex },
          { studentId: { $in: studentIds } },
        ];
      }

      if (department && department !== 'All') {
        const deptStudents = await User.find({
          role: 'student',
          department: department,
        }).select('_id');
        const deptStudentIds = deptStudents.map((s) => s._id);
        
        if (filter.studentId && filter.studentId.$in) {
          // Intersect with search results
          const existingIds = filter.studentId.$in.map((id) => id.toString());
          const intersected = deptStudentIds.filter((id) =>
            existingIds.includes(id.toString())
          );
          filter.studentId = { $in: intersected };
        } else {
          filter.studentId = { $in: deptStudentIds };
        }
      }
    }

    const activities = await Activity.find(filter)
      .populate('studentId', 'name email department userId')
      .sort({ createdAt: -1 });

    // Attach verification details if exists
    const activityIds = activities.map((a) => a._id);
    const verifications = await Verification.find({ activityId: { $in: activityIds } })
      .populate('verifiedBy', 'name email')
      .lean();

    const verificationMap = {};
    verifications.forEach((v) => {
      verificationMap[v.activityId.toString()] = v;
    });

    const enrichedActivities = activities.map((act) => {
      const obj = act.toObject();
      obj.verification = verificationMap[act._id.toString()] || null;
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: enrichedActivities.length,
      data: enrichedActivities,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching activities',
    });
  }
};

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
// @access  Private
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate(
      'studentId',
      'name email department userId'
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity record not found',
      });
    }

    // Role check: Student can only view their own activity
    const activityStudentId = (activity.studentId?._id || activity.studentId)?.toString();
    if (
      req.user.role === 'student' &&
      activityStudentId !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own activity records.',
      });
    }

    // Find verification record
    const verification = await Verification.findOne({ activityId: activity._id }).populate(
      'verifiedBy',
      'name email'
    );

    const data = activity.toObject();
    data.verification = verification;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching single activity:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching activity details',
    });
  }
};

// @desc    Create new student activity
// @route   POST /api/activities
// @access  Private (Student only)
export const createActivity = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only registered students can submit activity records.',
      });
    }

    const {
      activityTitle,
      activityCategory,
      eventName,
      organizer,
      activityDate,
      certificateStatus,
      description,
    } = req.body;

    if (
      !activityTitle ||
      !activityCategory ||
      !eventName ||
      !organizer ||
      !activityDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: Title, Category, Event Name, Organizer, and Date.',
      });
    }

    // Generate unique Activity ID (e.g., ACT-YYYY-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const activityId = `ACT-${new Date().getFullYear()}-${randomSuffix}`;

    // Automatically obtain studentId from authenticated user
    const activity = await Activity.create({
      activityId,
      studentId: req.user._id, // Automatic student binding
      activityTitle: activityTitle.trim(),
      activityCategory,
      eventName: eventName.trim(),
      organizer: organizer.trim(),
      activityDate: new Date(activityDate),
      certificateStatus: certificateStatus || 'Pending',
      verificationStatus: 'Pending', // New activities must initially show Pending
      description: description ? description.trim() : '',
    });

    const populatedActivity = await Activity.findById(activity._id).populate(
      'studentId',
      'name email department userId'
    );

    return res.status(201).json({
      success: true,
      message: 'Activity record submitted successfully and is pending verification.',
      data: populatedActivity,
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating activity record',
    });
  }
};

// @desc    Update existing activity
// @route   PUT /api/activities/:id
// @access  Private (Student: own activity; Admin: full management)
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity record not found',
      });
    }

    const isStudent = req.user.role === 'student';
    const activityStudentId = (activity.studentId?._id || activity.studentId)?.toString();

    // Student can only update their own activity
    if (isStudent && activityStudentId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only modify your own activity records.',
      });
    }

    const {
      activityTitle,
      activityCategory,
      eventName,
      organizer,
      activityDate,
      certificateStatus,
      description,
    } = req.body;

    if (activityTitle) activity.activityTitle = activityTitle.trim();
    if (activityCategory) activity.activityCategory = activityCategory;
    if (eventName) activity.eventName = eventName.trim();
    if (organizer) activity.organizer = organizer.trim();
    if (activityDate) activity.activityDate = new Date(activityDate);
    if (certificateStatus) activity.certificateStatus = certificateStatus;
    if (description !== undefined) activity.description = description.trim();

    // If student edits an activity that was previously rejected or pending, reset to Pending for re-verification
    if (isStudent) {
      activity.verificationStatus = 'Pending';
    }

    await activity.save();

    const updated = await Activity.findById(activity._id).populate(
      'studentId',
      'name email department userId'
    );

    return res.status(200).json({
      success: true,
      message: 'Activity record updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating activity record',
    });
  }
};

// @desc    Delete activity record
// @route   DELETE /api/activities/:id
// @access  Private (Student: own activity, Admin: any)
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity record not found',
      });
    }

    // Student can only delete their own activity
    const activityStudentId = (activity.studentId?._id || activity.studentId)?.toString();
    if (
      req.user.role === 'student' &&
      activityStudentId !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own activity records.',
      });
    }

    // Delete associated verification record if any
    await Verification.deleteMany({ activityId: activity._id });

    // Delete the activity
    await Activity.deleteOne({ _id: activity._id });

    return res.status(200).json({
      success: true,
      message: 'Activity record deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting activity record',
    });
  }
};
