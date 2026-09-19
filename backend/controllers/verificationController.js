import Activity from '../models/Activity.js';
import Verification from '../models/Verification.js';

// @desc    Get activities requiring review/verification (Admin only)
// @route   GET /api/verification
// @access  Private (Admin only)
export const getVerificationActivities = async (req, res) => {
  try {
    const { status, category, department } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.verificationStatus = status;
    }

    if (category && category !== 'All') {
      query.activityCategory = category;
    }

    const activities = await Activity.find(query)
      .populate('studentId', 'name email department userId')
      .sort({ createdAt: -1 });

    // Filter by student department if specified
    let filteredActivities = activities;
    if (department && department !== 'All') {
      filteredActivities = activities.filter(
        (act) => act.studentId && act.studentId.department === department
      );
    }

    // Attach existing verification records
    const activityIds = filteredActivities.map((a) => a._id);
    const verifications = await Verification.find({
      activityId: { $in: activityIds },
    })
      .populate('verifiedBy', 'name email')
      .lean();

    const verMap = {};
    verifications.forEach((v) => {
      verMap[v.activityId.toString()] = v;
    });

    const result = filteredActivities.map((act) => {
      const obj = act.toObject();
      obj.verification = verMap[act._id.toString()] || null;
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching verification activities:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching verification activities',
    });
  }
};

// @desc    Review activity (Approve or Reject with remarks) (Admin only)
// @route   PUT /api/verification/:id
// @access  Private (Admin only)
export const updateVerification = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    // Validation: Do not allow submitting verification without a valid status
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'A valid verification status ("Approved" or "Rejected") is required.',
      });
    }

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

    // Update or create Verification record
    let verification = await Verification.findOne({ activityId: activity._id });

    if (verification) {
      verification.verifiedBy = req.user._id;
      verification.verificationDate = new Date();
      verification.status = status;
      verification.remarks = remarks ? remarks.trim() : '';
      await verification.save();
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const verificationId = `VER-${new Date().getFullYear()}-${randomSuffix}`;

      verification = await Verification.create({
        verificationId,
        activityId: activity._id,
        verifiedBy: req.user._id,
        verificationDate: new Date(),
        status,
        remarks: remarks ? remarks.trim() : '',
      });
    }

    // Update Activity verification state
    activity.verificationStatus = status;
    await activity.save();

    // Populate verifiedBy info
    const populatedVerification = await Verification.findById(
      verification._id
    ).populate('verifiedBy', 'name email');

    const activityData = activity.toObject();
    activityData.verification = populatedVerification;

    return res.status(200).json({
      success: true,
      message: `Activity has been successfully marked as ${status}.`,
      data: activityData,
    });
  } catch (error) {
    console.error('Error updating verification:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during activity verification',
    });
  }
};

// @desc    Get all approved activities
// @route   GET /api/approvedActivities
// @access  Private (Student & Admin)
export const getApprovedActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ verificationStatus: 'Approved' })
      .populate('studentId', 'name email department userId')
      .sort({ activityDate: -1 });

    const activityIds = activities.map((a) => a._id);
    const verifications = await Verification.find({
      activityId: { $in: activityIds },
    })
      .populate('verifiedBy', 'name email')
      .lean();

    const verMap = {};
    verifications.forEach((v) => {
      verMap[v.activityId.toString()] = v;
    });

    const result = activities.map((act) => {
      const obj = act.toObject();
      obj.verification = verMap[act._id.toString()] || null;
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching approved activities:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching approved activities',
    });
  }
};
