// import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import axios from "axios";
// import { Navigate, Route, Routes } from "react-router-dom";
// import Register from "./assets/pages/Register";
// import Login from "./assets/pages/Login";
// import DoctorDashboard from "./assets/pages/doctor/DoctorDashboard";
// import ProtectedRoute from "./context/ProtectedRoute";
// import PatientDashboard from "./assets/pages/patient/PatientDashboard";
// import LabTechDashboard from "./assets/pages/labtech/LabTechDashboard";
// import DoctorSearch from "./assets/pages/DoctorSearch";

// function App() {
//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Doctor Routes */}
//         <Route
//           path="/doctor/dashboard"
//           element={
//             <ProtectedRoute requiredRole="DOCTOR">
//               <DoctorDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Patient Routes */}
//         <Route
//           path="/patient/dashboard"
//           element={
//             <ProtectedRoute requiredRole="PATIENT">
//               <PatientDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/patient/search-doctor"
//           element={
//             <ProtectedRoute requiredRole="PATIENT">
//               <DoctorSearch />
//             </ProtectedRoute>
//           }
//         />

//         {/* Lab Tech Routes */}
//         <Route
//           path="/labtech/dashboard"
//           element={
//             <ProtectedRoute requiredRole="LABTECH">
//               <LabTechDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./assets/pages/Register";
import Login from "./assets/pages/Login";
import DoctorDashboard from "./assets/pages/doctor/DoctorDashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import PatientDashboard from "./assets/pages/patient/PatientDashboard";
import LabTechDashboard from "./assets/pages/labtech/LabTechDashboard";
import DoctorSearch from "./assets/pages/DoctorSearch";
import Prescription from "./assets/pages/doctor/Prescription";
import PatientHistory from './assets/pages/doctor/PatientHistory';


// 🔹 Import new labtech pages
import LabRequests from "./assets/pages/labtech/LabRequests";
import UploadLabReport from "./assets/pages/labtech/UploadLabReport";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/doctor/create-prescription/:id" element={<Prescription show={true}  />} />

        <Route path="/doctor/edit-prescription/:id" element={<Prescription show={false}  />} />

        <Route path="/doctor/patient-history/:appointmentId" element={<PatientHistory />} />







        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/search-doctor"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <DoctorSearch />
            </ProtectedRoute>
          }
        />

        {/* Lab Tech Routes */}
        <Route
          path="/labtech/dashboard"
          element={
            <ProtectedRoute requiredRole="LABTECH">
              <LabTechDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🧪 Lab Report Management for Lab Techs */}
        <Route
          path="/labtech/lab-requests"
          element={
            <ProtectedRoute requiredRole="LABTECH">
              <LabRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labtech/upload-report/:id"
          element={
            <ProtectedRoute requiredRole="LABTECH">
              <UploadLabReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
