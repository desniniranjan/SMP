import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Verification from '../models/Verification.js';
import { connectDB, disconnectDB } from '../config/db.js';

dotenv.config();

export const seedInitialData = async () => {
  try {
    // 1. Check if admin exists
    const collegeAdminEmail = 'admin@college.edu';
    const envAdminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 6)
      ? process.env.ADMIN_PASSWORD
      : 'Admin@123';

    let adminUser = await User.findOne({ email: collegeAdminEmail });

    if (!adminUser) {
      console.log('Seeding initial College Administrator account...');
      adminUser = await User.create({
        userId: 'ADM-2026-001',
        name: 'Dr. Ramesh Sharma (Dean Academic)',
        email: collegeAdminEmail,
        password: 'Admin@123',
        role: 'admin',
        department: 'Academic Administration',
      });
      console.log(`Administrator created successfully: ${collegeAdminEmail}`);
    }

    if (envAdminEmail && envAdminEmail !== collegeAdminEmail) {
      const existingEnvAdmin = await User.findOne({ email: envAdminEmail });
      if (!existingEnvAdmin) {
        await User.create({
          userId: 'ADM-ENV-002',
          name: 'Primary Administrator',
          email: envAdminEmail,
          password: adminPassword,
          role: 'admin',
          department: 'Academic Administration',
        });
        console.log(`Env Administrator created successfully: ${envAdminEmail}`);
      }
    }

    // 2. Check if students exist; if not, seed realistic engineering student profiles
    const studentCount = await User.countDocuments({ role: 'student' });
    if (studentCount === 0) {
      console.log('Seeding demo students and activities for engineering college departments...');

      const studentsData = [
        {
          userId: 'STU-2026-101',
          name: 'Aarav Patel',
          email: 'aarav.cse@college.edu',
          password: 'Password@123',
          role: 'student',
          department: 'Computer Science & Engineering',
        },
        {
          userId: 'STU-2026-102',
          name: 'Priya Sundaram',
          email: 'priya.it@college.edu',
          password: 'Password@123',
          role: 'student',
          department: 'Information Technology',
        },
        {
          userId: 'STU-2026-103',
          name: 'Rohan Deshmukh',
          email: 'rohan.ece@college.edu',
          password: 'Password@123',
          role: 'student',
          department: 'Electronics & Communication',
        },
        {
          userId: 'STU-2026-104',
          name: 'Ananya Sharma',
          email: 'ananya.mech@college.edu',
          password: 'Password@123',
          role: 'student',
          department: 'Mechanical Engineering',
        },
      ];

      const createdStudents = await User.create(studentsData);

      // Seed realistic activities across categories
      const sampleActivities = [
        {
          activityId: 'ACT-2026-1001',
          studentId: createdStudents[0]._id, // Aarav (CSE)
          activityTitle: 'Smart India Hackathon 2026 National Finalist',
          activityCategory: 'Hackathon',
          eventName: 'Smart India Hackathon (Software Edition)',
          organizer: 'Ministry of Education & AICTE',
          activityDate: new Date('2026-08-15'),
          certificateStatus: 'Available',
          verificationStatus: 'Approved',
          description: 'Developed an AI-based Crop Health diagnostic tool for rural farmers.',
        },
        {
          activityId: 'ACT-2026-1002',
          studentId: createdStudents[0]._id, // Aarav (CSE)
          activityTitle: 'Full-Stack Cloud Native Development Bootcamp',
          activityCategory: 'Workshop',
          eventName: 'National Cloud Computing Conclave',
          organizer: 'AWS & College CSE Department',
          activityDate: new Date('2026-07-20'),
          certificateStatus: 'Available',
          verificationStatus: 'Pending',
          description: 'Hands-on 3-day workshop on containerization and microservices.',
        },
        {
          activityId: 'ACT-2026-1003',
          studentId: createdStudents[1]._id, // Priya (IT)
          activityTitle: 'Cybersecurity Analyst Internship',
          activityCategory: 'Internship',
          eventName: 'Summer Cybersecurity Fellowship 2026',
          organizer: 'CyberShield Infotech Solutions',
          activityDate: new Date('2026-06-30'),
          certificateStatus: 'Available',
          verificationStatus: 'Approved',
          description: 'Conducted penetration testing and vulnerability assessments.',
        },
        {
          activityId: 'ACT-2026-1004',
          studentId: createdStudents[1]._id, // Priya (IT)
          activityTitle: 'AWS Certified Solutions Architect Associate',
          activityCategory: 'Certification',
          eventName: 'AWS Global Certification Examination',
          organizer: 'Amazon Web Services',
          activityDate: new Date('2026-09-02'),
          certificateStatus: 'Available',
          verificationStatus: 'Pending',
          description: 'Passed official cloud architect examination with score 890/1000.',
        },
        {
          activityId: 'ACT-2026-1005',
          studentId: createdStudents[2]._id, // Rohan (ECE)
          activityTitle: 'Inter-College Robotics Challenge 1st Runner Up',
          activityCategory: 'Technical Competition',
          eventName: 'RoboQuest 2026 Annual Techfest',
          organizer: 'IIT Bombay TechFest',
          activityDate: new Date('2026-08-10'),
          certificateStatus: 'Available',
          verificationStatus: 'Approved',
          description: 'Constructed an autonomous line-follower and obstacle navigating robot.',
        },
        {
          activityId: 'ACT-2026-1006',
          studentId: createdStudents[2]._id, // Rohan (ECE)
          activityTitle: 'Embedded Systems & VLSI Design Seminar',
          activityCategory: 'Seminar',
          eventName: 'IEEE Semiconductor Summit 2026',
          organizer: 'IEEE Student Branch',
          activityDate: new Date('2026-09-05'),
          certificateStatus: 'Pending',
          verificationStatus: 'Pending',
          description: 'Attended deep dive on RISC-V architecture and FPGA synthesis.',
        },
        {
          activityId: 'ACT-2026-1007',
          studentId: createdStudents[3]._id, // Ananya (MECH)
          activityTitle: 'All-India Formula Student EV Design Competition',
          activityCategory: 'Technical Competition',
          eventName: 'Formula Bharat 2026',
          organizer: 'Curiosum Tech & SAE India',
          activityDate: new Date('2026-07-14'),
          certificateStatus: 'Available',
          verificationStatus: 'Approved',
          description: 'Lead designer for chassis ergonomics and aerodynamic simulation.',
        },
        {
          activityId: 'ACT-2026-1008',
          studentId: createdStudents[3]._id, // Ananya (MECH)
          activityTitle: 'State Level Inter-University Badminton Championship',
          activityCategory: 'Sports',
          eventName: 'University Annual Sports Meet',
          organizer: 'State Sports Authority',
          activityDate: new Date('2026-08-28'),
          certificateStatus: 'Available',
          verificationStatus: 'Rejected',
          description: 'Represented college in women singles badminton tournament.',
        },
      ];

      const createdActivities = await Activity.create(sampleActivities);

      // Create matching verification records for approved/rejected activities
      const verifications = [
        {
          verificationId: 'VER-2026-101',
          activityId: createdActivities[0]._id,
          verifiedBy: adminUser._id,
          verificationDate: new Date('2026-08-18'),
          status: 'Approved',
          remarks: 'Verified against SIH national finalist certificate and college records. Outstanding achievement!',
        },
        {
          verificationId: 'VER-2026-102',
          activityId: createdActivities[2]._id,
          verifiedBy: adminUser._id,
          verificationDate: new Date('2026-07-05'),
          status: 'Approved',
          remarks: 'Official company completion certificate and evaluation letter verified.',
        },
        {
          verificationId: 'VER-2026-103',
          activityId: createdActivities[4]._id,
          verifiedBy: adminUser._id,
          verificationDate: new Date('2026-08-12'),
          status: 'Approved',
          remarks: 'Winner trophy and certificate authenticated with Techfest coordinators.',
        },
        {
          verificationId: 'VER-2026-104',
          activityId: createdActivities[6]._id,
          verifiedBy: adminUser._id,
          verificationDate: new Date('2026-07-16'),
          status: 'Approved',
          remarks: 'SAE India registration and team vehicle technical report approved.',
        },
        {
          verificationId: 'VER-2026-105',
          activityId: createdActivities[7]._id,
          verifiedBy: adminUser._id,
          verificationDate: new Date('2026-09-01'),
          status: 'Rejected',
          remarks: 'Sports participation certificate missing official stamp of Sports Directorate. Please re-upload with university seal.',
        },
      ];

      await Verification.create(verifications);
      console.log('Sample engineering activities and verification records created successfully.');
    }
  } catch (err) {
    console.error('Seeder execution error:', err.message);
  }
};

// If run directly via CLI: `node backend/seed/adminSeeder.js`
if (process.argv[1] && process.argv[1].endsWith('adminSeeder.js')) {
  (async () => {
    await connectDB();
    await seedInitialData();
    console.log('Seeder process complete.');
    process.exit(0);
  })();
}
