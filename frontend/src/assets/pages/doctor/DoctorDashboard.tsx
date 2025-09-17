import React, { useState, useEffect } from "react";
import type { DoctorProfile, DoctorDetails, User } from "../../../types";
import { doctorService } from "../../../services/DoctorService";
import UserProfile from "../../../components/common/UserProfile";
import DoctorProfileForm from "./DoctorProfileForm";
import DoctorProfileView from "./DoctorProfileView";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

// Icons (assuming you're using react-icons)
import {
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiSettings,
  FiStar,
  FiEdit3,
  FiX,
  FiCheck,
  FiClock,
  FiAward,
  FiMapPin,
  FiPhone,
  FiMail,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../../../api/auth";

const DoctorDashboard: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await doctorService.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data: DoctorDetails) => {
    try {
      setError("");
      if (profile?.profileComplete) {
        await doctorService.updateProfile(data);
      } else {
        await doctorService.saveProfile(data);
      }
      setEditing(false);
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile");
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) return <LoadingSpinner />;

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 text-red-700 border border-red-300 p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiX className="text-red-500 text-xl" />
            </div>
          </div>
          <p className="text-center">Error loading profile: {error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 w-full py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user: User = {
    userId: 0,
    name: profile.name,
    email: profile.email,
    role: "Doctor",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiUserCheck className="mr-3 text-blue-500" />
            Doctor Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {!editing && profile.profileComplete && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all duration-300 hover:shadow-md"
            >
              <FiEdit3 className="mr-2" />
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-4 bg-red-100 text-red-700 rounded-lg shadow hover:bg-red-200 transition-all duration-300"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {user.role}
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center text-gray-700">
                <FiAward className="text-blue-500 mr-3" />
                <span>{profile.specialization || "Not specified"}</span>
              </div>

              {profile.licenseNumber && (
                <div className="flex items-center text-gray-700">
                  <FiStar className="text-blue-500 mr-3" />
                  <span>License: {profile.licenseNumber}</span>
                </div>
              )}

              {profile.availableTimes && (
                <div className="flex items-center text-gray-700">
                  <FiClock className="text-blue-500 mr-3" />
                  <span>Available: {profile.availableTimes}</span>
                </div>
              )}
            </div>

            {/* <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">42</div>
                  <div className="text-xs text-gray-600">Patients</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">16</div>
                  <div className="text-xs text-gray-600">Appointments</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Column - Content Area */}
        <div className="lg:col-span-2">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "profile"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FiUserCheck className="mr-2" />
                Profile
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "schedule"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("schedule")}
              >
                <FiCalendar className="mr-2" />
                Schedule
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "patients"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("patients")}
              >
                <FiUsers className="mr-2" />
                Patients
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "reports"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("reports")}
              >
                <FiBarChart2 className="mr-2" />
                Reports
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "settings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <FiSettings className="mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiX className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                {editing || !profile.profileComplete
                  ? "Edit Profile"
                  : "Professional Profile"}
                {profile.profileComplete && !editing && (
                  <span className="ml-3 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                    Complete
                  </span>
                )}
              </h2>

              {editing && (
                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <FiX className="mr-1" />
                  Cancel
                </button>
              )}
            </div>

            {editing || !profile.profileComplete ? (
              <DoctorProfileForm
                initialData={
                  profile.profileComplete
                    ? {
                        specialization: profile.specialization || "",
                        licenseNumber: profile.licenseNumber || "",
                        availableTimes: profile.availableTimes || "",
                      }
                    : undefined
                }
                onSubmit={handleSaveProfile}
                isEditing={profile.profileComplete}
              />
            ) : (
              <DoctorProfileView
                profile={profile}
                onEdit={() => setEditing(true)}
              />
            )}
          </div>

          {/* Additional Dashboard Cards */}
          {!editing && profile.profileComplete && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <FiClock className="text-blue-500 mr-2" />
                  Today's Appointments
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-600">10:00 AM - 10:30 AM</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Check-up</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-gray-600">2:15 PM - 2:45 PM</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Follow-up</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <FiBarChart2 className="text-blue-500 mr-2" />
                  Weekly Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Appointments</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Patients</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancellations</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                  View Full Report →
                </button>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
