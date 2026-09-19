import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityTitle: {
      type: String,
      required: [true, 'Please provide activity title'],
      trim: true,
    },
    activityCategory: {
      type: String,
      required: [true, 'Please select activity category'],
      enum: [
        'Workshop',
        'Seminar',
        'Internship',
        'Certification',
        'Hackathon',
        'Sports',
        'Cultural Event',
        'Technical Competition',
        'Other',
      ],
    },
    eventName: {
      type: String,
      required: [true, 'Please provide event name'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Please provide organizer name/institution'],
      trim: true,
    },
    activityDate: {
      type: Date,
      required: [true, 'Please provide activity date'],
    },
    certificateStatus: {
      type: String,
      required: true,
      enum: ['Available', 'Not Available', 'Pending'],
      default: 'Pending',
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance and query optimization
activitySchema.index({ studentId: 1 });
activitySchema.index({ activityCategory: 1 });
activitySchema.index({ activityDate: -1 });
activitySchema.index({ verificationStatus: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
