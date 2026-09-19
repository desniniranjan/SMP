import Activity from '../models/Activity.js';
import User from '../models/User.js';
import Verification from '../models/Verification.js';

// @desc    Get department-wise activity report using MongoDB aggregation
// @route   GET /api/reports/department-summary
// @access  Private (Admin only)
export const getDepartmentSummary = async (req, res) => {
  try {
    // MongoDB Aggregation Pipeline
    const departmentStats = await Activity.aggregate([
      // Lookup the student user to retrieve department
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: '$student',
      },
      // Group by department and aggregate counts
      {
        $group: {
          _id: '$student.department',
          totalActivities: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$verificationStatus', 'Approved'] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$verificationStatus', 'Pending'] }, 1, 0],
            },
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ['$verificationStatus', 'Rejected'] }, 1, 0],
            },
          },
        },
      },
      // Project fields cleanly
      {
        $project: {
          department: '$_id',
          totalActivities: 1,
          approved: 1,
          pending: 1,
          rejected: 1,
          _id: 0,
        },
      },
      // Sort by total activities descending
      {
        $sort: { totalActivities: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: departmentStats,
    });
  } catch (error) {
    console.error('Department aggregation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating department report',
    });
  }
};

// @desc    Get overall portal summary metrics for Admin Dashboard
// @route   GET /api/reports/portal-summary
// @access  Private (Admin only)
export const getPortalSummary = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalActivities = await Activity.countDocuments();
    const pendingVerification = await Activity.countDocuments({
      verificationStatus: 'Pending',
    });
    const approved = await Activity.countDocuments({
      verificationStatus: 'Approved',
    });
    const rejected = await Activity.countDocuments({
      verificationStatus: 'Rejected',
    });

    const recentSubmissions = await Activity.find()
      .populate('studentId', 'name email department userId')
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingList = await Activity.find({ verificationStatus: 'Pending' })
      .populate('studentId', 'name email department userId')
      .sort({ createdAt: -1 })
      .limit(5);

    // Attach verification records to recent submissions
    const recentIds = recentSubmissions.map((act) => act._id);
    const verifications = await Verification.find({ activityId: { $in: recentIds } })
      .populate('verifiedBy', 'name email')
      .lean();
    const verMap = {};
    verifications.forEach((v) => {
      verMap[v.activityId.toString()] = v;
    });
    const enrichedRecentSubmissions = recentSubmissions.map((act) => {
      const obj = act.toObject();
      obj.verification = verMap[act._id.toString()] || null;
      return obj;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalActivities,
        pendingVerification,
        approved,
        rejected,
        recentSubmissions: enrichedRecentSubmissions,
        pendingList,
      },
    });
  } catch (error) {
    console.error('Portal summary error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating portal summary',
    });
  }
};
