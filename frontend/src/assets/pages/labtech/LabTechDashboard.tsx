// import React, { useState, useEffect } from "react";
// import type { LabTechProfile, LabTechDetails, User } from "../../../types";
// import { getUser, logout } from "../../../api/auth";
// import { labTechService } from "../../../services/LabTechService";
// import LoadingSpinner from "../../../components/common/LoadingSpinner";
// import UserProfile from "../../../components/common/UserProfile";
// import LabTechProfileForm from "./LabTechProfileForm";
// import LabTechProfileView from "./LabTechProfileView";

// // Icons
// import {
//   FiLogOut,
//   FiUser,
//   FiSettings,
//   FiBarChart2,
//   FiCalendar,
//   FiUsers,
//   FiFileText,
//   FiCheckCircle,
//   FiXCircle,
//   FiEdit3,
//   FiTrash2,
//   FiAward,
//   FiClock,
//   FiBell,
//   FiSearch,
//   FiPlusCircle,
// } from "react-icons/fi";

// const LabTechDashboard: React.FC = () => {
//   const [profile, setProfile] = useState<LabTechProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [activeTab, setActiveTab] = useState("profile");

//   const user = getUser();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const profileData = await labTechService.getProfile();
//       setProfile(profileData);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to fetch profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveProfile = async (data: LabTechDetails) => {
//     try {
//       setError("");
//       setSuccess("");
//       if (profile?.profileComplete) {
//         await labTechService.updateProfile(data);
//         setSuccess("Profile updated successfully");
//       } else {
//         await labTechService.saveProfile(data);
//         setSuccess("Profile saved successfully");
//       }
//       setEditing(false);
//       await fetchProfile();
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to save profile");
//     }
//   };

//   const handleDeleteProfile = async () => {
//     if (
//       window.confirm("Are you sure you want to delete your department details?")
//     ) {
//       try {
//         setError("");
//         setSuccess("");
//         await labTechService.deleteProfile();
//         setSuccess("Department details deleted successfully");
//         setEditing(false);
//         await fetchProfile();
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to delete profile");
//       }
//     }
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="bg-red-50 text-red-700 border border-red-300 p-6 rounded-lg shadow-md max-w-md w-full">
//           <div className="flex items-center justify-center mb-3">
//             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
//               <FiXCircle className="text-red-500 text-xl" />
//             </div>
//           </div>
//           <p className="text-center">Error: User not found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//       {/* Header */}
//       <header className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
//         <div className="flex items-center mb-4 md:mb-0">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//             <FiUser className="mr-3 text-blue-500" />
//             Lab Technician Dashboard
//           </h1>
//         </div>

//         <div className="flex items-center space-x-4">
//           <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
//             <FiBell className="text-gray-600" />
//           </button>
//           <button
//             onClick={handleLogout}
//             className="flex items-center py-2 px-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-300"
//           >
//             <FiLogOut className="mr-2" />
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column - User Profile Card */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
//             <div className="flex flex-col items-center text-center mb-6">
//               <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
//                 <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center">
//                   <span className="text-2xl font-bold text-blue-600">
//                     {profile?.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </span>
//                 </div>
//               </div>
//               <h2 className="text-xl font-bold text-gray-800">
//                 {profile?.name}
//               </h2>
//               <p className="text-gray-600">{user.email}</p>
//               <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
//                 {user.role}
//               </div>
//             </div>

//             <div className="space-y-4 border-t border-gray-100 pt-6">
//               {profile?.department && (
//                 <div className="flex items-center text-gray-700">
//                   <FiAward className="text-blue-500 mr-3" />
//                   <span>Department: {profile.department}</span>
//                 </div>
//               )}

//               <div className="flex items-center text-gray-700">
//                 <FiClock className="text-blue-500 mr-3" />
//                 <span>Last login: Today, 09:42 AM</span>
//               </div>
//             </div>

//             {/* <div className="mt-8 pt-6 border-t border-gray-100">
//               <h3 className="font-medium text-gray-700 mb-3">Today's Stats</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-blue-50 p-3 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-blue-600">18</div>
//                   <div className="text-xs text-gray-600">Tests</div>
//                 </div>
//                 <div className="bg-green-50 p-3 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-green-600">7</div>
//                   <div className="text-xs text-gray-600">Completed</div>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* Right Column - Content Area */}
//         <div className="lg:col-span-2">
//           {/* Navigation Tabs */}
//           <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
//             <div className="flex overflow-x-auto">
//               <button
//                 className={`px-6 py-4 font-medium flex items-center ${
//                   activeTab === "profile"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("profile")}
//               >
//                 <FiUser className="mr-2" />
//                 Profile
//               </button>
//               <button
//                 className={`px-6 py-4 font-medium flex items-center ${
//                   activeTab === "tests"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("tests")}
//               >
//                 <FiBarChart2 className="mr-2" />
//                 Tests
//               </button>
//               <button
//                 className={`px-6 py-4 font-medium flex items-center ${
//                   activeTab === "results"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("results")}
//               >
//                 <FiFileText className="mr-2" />
//                 Results
//               </button>
//               <button
//                 className={`px-6 py-4 font-medium flex items-center ${
//                   activeTab === "schedule"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("schedule")}
//               >
//                 <FiCalendar className="mr-2" />
//                 Schedule
//               </button>
//               <button
//                 className={`px-6 py-4 font-medium flex items-center ${
//                   activeTab === "settings"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("settings")}
//               >
//                 <FiSettings className="mr-2" />
//                 Settings
//               </button>
//             </div>
//           </div>

//           {/* Success Message */}
//           {success && (
//             <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <FiCheckCircle className="h-5 w-5 text-green-400" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-green-700">{success}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <FiXCircle className="h-5 w-5 text-red-400" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Profile Section */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                 {editing || !profile?.profileComplete
//                   ? "Edit Profile"
//                   : "Professional Profile"}
//                 {profile?.profileComplete && !editing && (
//                   <span className="ml-3 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
//                     Complete
//                   </span>
//                 )}
//               </h2>

//               {editing && (
//                 <button
//                   onClick={() => setEditing(false)}
//                   className="text-gray-500 hover:text-gray-700 flex items-center"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>

//             {editing || !profile?.profileComplete ? (
//               <LabTechProfileForm
//                 initialData={
//                   profile?.profileComplete
//                     ? {
//                         department: profile.department || "",
//                       }
//                     : undefined
//                 }
//                 onSubmit={handleSaveProfile}
//                 isEditing={profile?.profileComplete || false}
//                 onCancel={() => setEditing(false)}
//               />
//             ) : (
//               <LabTechProfileView
//                 profile={profile}
//                 onEdit={() => setEditing(true)}
//                 onDelete={handleDeleteProfile}
//               />
//             )}
//           </div>

//           {/* Additional Dashboard Cards */}
//           {!editing && profile?.profileComplete && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//               {/* <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
//                   <FiClock className="text-blue-500 mr-2" />
//                   Pending Tests
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                     <div>
//                       <p className="font-medium">Blood Test</p>
//                       <p className="text-sm text-gray-600">Patient: John Doe</p>
//                     </div>
//                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
//                   </div>
//                   <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                     <div>
//                       <p className="font-medium">Urine Analysis</p>
//                       <p className="text-sm text-gray-600">Patient: Jane Smith</p>
//                     </div>
//                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
//                   </div>
//                 </div>
//                 <button className="mt-4 w-full py-2 text-center text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center">
//                   <FiPlusCircle className="mr-2" />
//                   Add New Test
//                 </button>
//               </div>
              
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
//                   <FiBarChart2 className="text-blue-500 mr-2" />
//                   Weekly Summary
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tests Completed</span>
//                     <span className="font-medium">42</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Pending Tests</span>
//                     <span className="font-medium">8</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Average Processing Time</span>
//                     <span className="font-medium">2.4h</span>
//                   </div>
//                 </div>
//                 <button className="mt-4 w-full py-2 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
//                   View Full Report →
//                 </button>
//               </div> */}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LabTechDashboard;






import React, { useState, useEffect } from "react";
import type { LabTechProfile, LabTechDetails, User } from "../../../types";
import { getUser, logout } from "../../../api/auth";
import { labTechService } from "../../../services/LabTechService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import LabTechProfileForm from "./LabTechProfileForm";
import LabTechProfileView from "./LabTechProfileView";
import LabRequests from "../labtech/LabRequests"; // import LabRequests

// Icons
import {
  FiLogOut,
  FiUser,
  FiSettings,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiClock,
  FiBell,
} from "react-icons/fi";

const LabTechDashboard: React.FC = () => {
  const [profile, setProfile] = useState<LabTechProfile | null>(null);
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
    if (window.confirm("Are you sure you want to delete your department details?")) {
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

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 text-red-700 border border-red-300 p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiXCircle className="text-red-500 text-xl" />
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
            Lab Technician Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <FiBell className="text-gray-600" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-300"
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
                    {profile?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{profile?.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {user.role}
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-6">
              {profile?.department && (
                <div className="flex items-center text-gray-700">
                  <FiAward className="text-blue-500 mr-3" />
                  <span>Department: {profile.department}</span>
                </div>
              )}

              
            </div>
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
                <FiUser className="mr-2" /> Profile
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "tests"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("tests")}
              >
                <FiBarChart2 className="mr-2" /> Tests
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "results"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("results")}
              >
                <FiFileText className="mr-2" /> Results
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "schedule"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("schedule")}
              >
                <FiCalendar className="mr-2" /> Schedule
              </button>
              <button
                className={`px-6 py-4 font-medium flex items-center ${
                  activeTab === "settings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <FiSettings className="mr-2" /> Settings
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiXCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {activeTab === "profile" && (
              <div>
                {/* Profile Section */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    {editing || !profile?.profileComplete
                      ? "Edit Profile"
                      : "Professional Profile"}
                    {profile?.profileComplete && !editing && (
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
                      Cancel
                    </button>
                  )}
                </div>

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
            )}

            {activeTab === "tests" && <LabRequests />}

            {activeTab === "results" && <div>Results Section (coming soon)</div>}
            {activeTab === "schedule" && <div>Schedule Section (coming soon)</div>}
            {activeTab === "settings" && <div>Settings Section (coming soon)</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTechDashboard;
