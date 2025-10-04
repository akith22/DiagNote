import React, { useState, useEffect } from "react";
import type { PatientProfile, PatientDetails, User } from "../../../types";
import { getUser, logout } from "../../../api/auth";
import { patientService } from "../../../services/PatientService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import PatientProfileForm from "./PatientProfileForm";
import PatientProfileView from "./PatientProfileView";
import Appointments from "./Appointments";
import { Link } from "react-router-dom";

import {
  FiCalendar,
  FiUsers,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiStar,
  FiEdit3,
  FiX,
  FiCheck,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";

const PatientDashboard: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const user = getUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const profileData = await patientService.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data: PatientDetails) => {
    try {
      setError("");
      setSuccess("");
      if (profile?.profileComplete) {
        await patientService.updateProfile(data);
        setSuccess("Profile updated successfully");
      } else {
        await patientService.saveProfile(data);
        setSuccess("Profile saved successfully");
      }
      setEditing(false);
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm("Are you sure you want to delete your personal details?")
    ) {
      try {
        setError("");
        setSuccess("");
        await patientService.deleteProfile();
        setSuccess("Personal details deleted successfully");
        setEditing(false);
        await fetchProfile();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete profile");
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 text-red-700 border border-red-300 p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiX className="text-red-500 text-xl" />
            </div>
          </div>
          <p className="text-center">Error: User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiUser className="mr-3 text-blue-500" />
            Patient Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Doctor Search Button */}
          <Link
            to="/patient/search-doctor"
            className="flex items-center py-2 px-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all duration-300 hover:shadow-md"
          >
            Search Doctors
          </Link>

          {!editing && profile?.profileComplete && (
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

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FiCheck className="h-5 w-5 text-green-400" />
            <p className="ml-3 text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FiX className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {profile?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {profile?.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Patient
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-6">
              {profile?.gender && (
                <div className="flex items-center text-gray-700">
                  <FiUser className="text-blue-500 mr-3" />
                  <span>{profile.gender}</span>
                </div>
              )}

              {profile?.age && (
                <div className="flex items-center text-gray-700">
                  <FiHeart className="text-blue-500 mr-3" />
                  <span>{profile.age} years old</span>
                </div>
              )}

              {profile?.address && (
                <div className="flex items-center text-gray-700">
                  <FiMapPin className="text-blue-500 mr-3" />
                  <span>{profile.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          {/* Tabs */}
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
                <FiUser className="mr-2" />
                Profile
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "appointments"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("appointments")}
              >
                <FiCalendar className="mr-2" />
                Appointments
              </button>

              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "prescriptions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("prescriptions")}
              >
                <FiHeart className="mr-2" />
                Prescriptions
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

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {activeTab === "profile" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    {editing || !profile?.profileComplete
                      ? "Edit Profile"
                      : "Personal Profile"}
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

                {editing || !profile?.profileComplete ? (
                  <PatientProfileForm
                    initialData={
                      profile?.profileComplete
                        ? {
                            gender: profile.gender || "",
                            address: profile.address || "",
                            age: profile.age || 0,
                          }
                        : undefined
                    }
                    onSubmit={handleSaveProfile}
                    isEditing={profile?.profileComplete || false}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <PatientProfileView
                    profile={profile}
                    onEdit={() => setEditing(true)}
                    onDelete={handleDeleteProfile}
                  />
                )}
              </>
            )}

            {activeTab === "appointments" && (
              <Appointments patientEmail={user.email} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
