import React, { useState, useEffect } from "react";
import type { DoctorProfile, DoctorDetails, User } from "../../../types";
import { doctorService } from "../../../api/auth";
import UserProfile from "../../../components/common/UserProfile";
import DoctorProfileForm from "./DoctorProfileForm";
import DoctorProfileView from "./DoctorProfileView";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const DoctorDashboard: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

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
      await fetchProfile(); // Refresh the profile data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return <div>Error loading profile: {error}</div>;
  }

  const user: User = {
    userId: 0, // This would come from your auth context
    name: profile.name,
    email: profile.email,
    role: "DOCTOR",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

      <UserProfile user={user} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
        <DoctorProfileView profile={profile} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
};

export default DoctorDashboard;
