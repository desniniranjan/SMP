import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    verificationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verificationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, 'Please specify verification status'],
      enum: ['Pending', 'Approved', 'Rejected'],
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
verificationSchema.index({ activityId: 1 });
verificationSchema.index({ verifiedBy: 1 });
verificationSchema.index({ status: 1 });

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;
