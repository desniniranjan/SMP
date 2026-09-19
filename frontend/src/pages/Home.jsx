import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle,
  Building,
  UserCheck,
  FolderArchive,
  BookOpen,
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Banner / Academic Header */}
      <div className="bg-indigo-900 text-indigo-100 border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-indigo-300" />
            <span>Engineering College Accreditation & Activity Assessment Board</span>
          </div>
          <span className="hidden sm:inline text-indigo-300">
            NAAC / NBA Criteria 3 & 5 Compliance Repository
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>E Batch 4 – Project 2 Specification</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Student Activity Record Management Portal
            </h1>

            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              A centralized portal for maintaining student academic and extracurricular
              activity records. Designed for engineering colleges to securely submit,
              verify, and maintain the complete activity history of every student across
              workshops, hackathons, certifications, and technical competitions.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <Link
                  id="btn-home-dashboard"
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                >
                  <span>Go to {user?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    id="btn-home-login"
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                  >
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    id="btn-home-register"
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all"
                  >
                    <span>Student Registration</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Three Core Sections */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Section 1: Student Activities */}
            <div
              id="section-student-activities"
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Student Activities
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Students can log technical workshops, research seminars, industry internships,
                global certifications, hackathons, sports, and cultural events with event
                organizers and certificate status.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Categorized submission workflow</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Editable draft & pending records</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time verification tracking</span>
                </li>
              </ul>
            </div>

            {/* Section 2: Activity Verification */}
            <div
              id="section-activity-verification"
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Activity Verification
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                College administrators review student submissions against college guidelines,
                authenticate participation certificates, approve or reject activities, and
                provide corrective feedback.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Strict admin review queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Official audit remarks & timestamp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Two-tier role protection</span>
                </li>
              </ul>
            </div>

            {/* Section 3: Digital Records */}
            <div
              id="section-digital-records"
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Digital Records
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Automated database aggregation generates real-time department-wise activity
                metrics (CSE, IT, ECE, MECH) suitable for academic accreditation reports
                and student portfolios.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>MongoDB aggregation pipelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Department summaries (Approved/Pending/Rejected)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permanent verifiable activity history</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Student Activity Record Management Portal • Engineering College Division</span>
          <span>Role-Based Access Control • JavaScript Only Architecture</span>
        </div>
      </footer>
    </div>
  );
}
