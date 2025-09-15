import React, { useState, useEffect } from "react";
import type { LabTechProfile, LabTechDetails, User } from "../../../types";
import { getUser, logout } from "../../../api/auth";
import { labTechService } from "../../../services/LabTechService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import UserProfile from "../../../components/common/UserProfile";
import LabTechProfileForm from "./LabTechProfileForm";
import LabTechProfileView from "./LabTechProfileView";

const LabTechDashboard: React.FC = () => {
  const [profile, setProfile] = useState<LabTechProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = getUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const profileData = await labTechService.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data: LabTechDetails) => {
    try {
      setError("");
      setSuccess("");
      if (profile?.profileComplete) {
        await labTechService.updateProfile(data);
        setSuccess("Profile updated successfully");
      } else {
        await labTechService.saveProfile(data);
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
      window.confirm("Are you sure you want to delete your department details?")
    ) {
      try {
        setError("");
        setSuccess("");
        await labTechService.deleteProfile();
        setSuccess("Department details deleted successfully");
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div>Error: User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lab Technician Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <UserProfile user={user} />

      {editing || !profile?.profileComplete ? (
        <LabTechProfileForm
          initialData={
            profile?.profileComplete
              ? {
                  department: profile.department || "",
                }
              : undefined
          }
          onSubmit={handleSaveProfile}
          isEditing={profile?.profileComplete || false}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <LabTechProfileView
          profile={profile}
          onEdit={() => setEditing(true)}
          onDelete={handleDeleteProfile}
        />
      )}
    </div>
  );
};

export default LabTechDashboard;
