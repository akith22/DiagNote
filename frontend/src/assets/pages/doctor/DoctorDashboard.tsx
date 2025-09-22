import React, { useState, useEffect } from "react";
import type { DoctorProfile, DoctorDetails, User } from "../../../types";
import { doctorService } from "../../../services/DoctorService";
import UserProfile from "../../../components/common/UserProfile";
import DoctorProfileForm from "./DoctorProfileForm";
import DoctorProfileView from "./DoctorProfileView";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

// Icons
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
  FiHeart,
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
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="bg-white text-red-600 p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 border border-red-100">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <FiX className="text-red-500 text-2xl" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">Error Loading Profile</h3>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow hover:shadow-md"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 md:p-8">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-100">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <FiHeart className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
            <p className="text-gray-500">Manage your practice and profile</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!editing && profile.profileComplete && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center py-2.5 px-5 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-all duration-300 hover:shadow-md"
            >
              <FiEdit3 className="mr-2" />
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center py-2.5 px-5 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 transition-all duration-300"
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
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8 border border-gray-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-bold text-blue-700">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>
                {profile.profileComplete && (
                  <div className="absolute -bottom-1 -right-1 bg-green-100 rounded-full p-1.5 border-2 border-white">
                    <FiCheck className="text-green-600 text-xs" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{user.email}</p>
              <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {user.role}
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center text-gray-700 p-3 bg-blue-50 rounded-lg">
                <FiAward className="text-blue-600 mr-3 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">Specialization</p>
                  <p className="font-medium">{profile.specialization || "Not specified"}</p>
                </div>
              </div>

              {profile.licenseNumber && (
                <div className="flex items-center text-gray-700 p-3 bg-blue-50 rounded-lg">
                  <FiStar className="text-blue-600 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{profile.licenseNumber}</p>
                  </div>
                </div>
              )}

              {profile.availableTimes && (
                <div className="flex items-center text-gray-700 p-3 bg-blue-50 rounded-lg">
                  <FiClock className="text-blue-600 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500">Available Times</p>
                    <p className="font-medium">{profile.availableTimes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-4 text-sm uppercase tracking-wide">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">42</div>
                  <div className="text-xs text-gray-600 mt-1">Patients</div>
                </div>
                <div className="bg-teal-50 p-4 rounded-xl text-center border border-teal-100">
                  <div className="text-2xl font-bold text-teal-700">16</div>
                  <div className="text-xs text-gray-600 mt-1">Appointments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content Area */}
        <div className="lg:col-span-2">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden border border-gray-100">
            <div className="flex overflow-x-auto">
              {[
                { id: "profile", icon: FiUserCheck, label: "Profile" },
                { id: "schedule", icon: FiCalendar, label: "Schedule" },
                { id: "patients", icon: FiUsers, label: "Patients" },
                { id: "reports", icon: FiBarChart2, label: "Reports" },
                { id: "settings", icon: FiSettings, label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-4 font-medium flex items-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiX className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {editing || !profile.profileComplete
                  ? "Edit Professional Profile"
                  : "Professional Profile"}
                {profile.profileComplete && !editing && (
                  <span className="ml-3 text-xs bg-green-100 text-green-800 py-1 px-2.5 rounded-full">
                    Complete
                  </span>
                )}
              </h2>

              {editing && (
                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-500 hover:text-gray-700 flex items-center text-sm py-1.5 px-3 bg-gray-100 rounded-lg"
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
          {!editing && profile.profileComplete && activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <FiClock className="text-blue-600 mr-2" />
                  Today's Appointments
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div>
                      <p className="font-medium text-gray-800">John Doe</p>
                      <p className="text-sm text-gray-600">10:00 AM - 10:30 AM</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">Check-up</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div>
                      <p className="font-medium text-gray-800">Jane Smith</p>
                      <p className="text-sm text-gray-600">2:15 PM - 2:45 PM</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">Follow-up</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 text-center text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 rounded-lg">
                  View All Appointments →
                </button>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <FiBarChart2 className="text-blue-600 mr-2" />
                  Weekly Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Completed Appointments</span>
                    <span className="font-medium text-blue-700">12</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">New Patients</span>
                    <span className="font-medium text-blue-700">3</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Cancellations</span>
                    <span className="font-medium text-blue-700">2</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 text-center text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 rounded-lg">
                  View Full Report →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;