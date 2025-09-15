// import React, { useState, useEffect } from "react";
// import type { DoctorProfile, DoctorDetails, User } from "../../../types";
// import { doctorService } from "../../../services/DoctorService";
// ``;
// import UserProfile from "../../../components/common/UserProfile";
// import DoctorProfileForm from "./DoctorProfileForm";
// import DoctorProfileView from "./DoctorProfileView";
// import LoadingSpinner from "../../../components/common/LoadingSpinner";

// const DoctorDashboard: React.FC = () => {
//   const [profile, setProfile] = useState<DoctorProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const profileData = await doctorService.getProfile();
//       setProfile(profileData);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to fetch profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveProfile = async (data: DoctorDetails) => {
//     try {
//       setError("");
//       if (profile?.profileComplete) {
//         await doctorService.updateProfile(data);
//       } else {
//         await doctorService.saveProfile(data);
//       }
//       setEditing(false);
//       await fetchProfile(); // Refresh the profile data
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to save profile");
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!profile) {
//     return <div>Error loading profile: {error}</div>;
//   }

//   const user: User = {
//     userId: 0, // This would come from your auth context
//     name: profile.name,
//     email: profile.email,
//     role: "",
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

//       <UserProfile user={user} />

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {editing || !profile.profileComplete ? (
//         <DoctorProfileForm
//           initialData={
//             profile.profileComplete
//               ? {
//                   specialization: profile.specialization || "",
//                   licenseNumber: profile.licenseNumber || "",
//                   availableTimes: profile.availableTimes || "",
//                 }
//               : undefined
//           }
//           onSubmit={handleSaveProfile}
//           isEditing={profile.profileComplete}
//         />
//       ) : (
//         <DoctorProfileView profile={profile} onEdit={() => setEditing(true)} />
//       )}
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useState, useEffect } from "react";
import type { DoctorProfile, DoctorDetails, User } from "../../../types";
import { doctorService } from "../../../services/DoctorService";
import UserProfile from "../../../components/common/UserProfile";
import DoctorProfileForm from "./DoctorProfileForm";
import DoctorProfileView from "./DoctorProfileView";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const DoctorDashboard: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);git 
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
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-50 text-red-700 border border-red-300 p-6 rounded-lg shadow-md">
          Error loading profile: {error}
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-500 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-10">CLINIK</h2>
        <nav className="flex flex-col gap-4">
          <button className="py-2 px-3 rounded hover:bg-indigo-400 text-left">Schedule</button>
          <button className="py-2 px-3 rounded hover:bg-indigo-400 text-left">Employees</button>
          <button className="py-2 px-3 rounded hover:bg-indigo-400 bg-indigo-700 text-left">Patients</button>
          <button className="py-2 px-3 rounded hover:bg-indigo-400 text-left">Reports</button>
          <button className="py-2 px-3 rounded hover:bg-indigo-400 text-left">Settings</button>
        </nav>
        <div className="mt-auto">
          <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-600 transition">
            Upgrade to PRO
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <button
            onClick={() => setEditing(true)}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* User Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 flex items-center gap-6 border-l-4 border-blue-500">
          <UserProfile user={user} />
          <div className="text-gray-700">
            Welcome back, <span className="font-semibold">{user.name}</span>! Manage your profile and availability here.
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow">
              {error}
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </main>
    </div>
  );
};

export default DoctorDashboard;

