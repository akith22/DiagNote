import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./assets/pages/Register";
import Login from "./assets/pages/Login";
import DoctorDashboard from "./assets/pages/doctor/DoctorDashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import PatientDashboard from "./assets/pages/patient/PatientDashboard";
import LabTechDashboard from "./assets/pages/labtech/LabTechDashboard";
import DoctorSearch from "./assets/pages/DoctorSearch";
import Prescription from "./assets/pages/doctor/Prescription";
import PatientHistory from "./assets/pages/doctor/PatientHistory";

// 🔹 Import new labtech pages
import LabRequests from "./assets/pages/labtech/LabRequests";
import UploadLabReport from "./assets/pages/labtech/UploadLabReport";
import ViewLabReport from "./assets/pages/labtech/ViewLabReport";

// 🔹 Import new patient lab report pages
import LabReports from "./assets/pages/patient/LabReports";
import LabReportPreview from "./assets/pages/patient/LabReportPreview";

// 🔹 Import new patient prescription pages
import PrescriptionList from "./assets/pages/patient/Prescription";
import PrescriptionDetail from "./assets/pages/patient/PrescriptionDetail";

import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
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
        <Route
          path="/doctor/create-prescription/:id"
          element={<Prescription show={true} />}
        />
        <Route
          path="/doctor/edit-prescription/:id"
          element={<Prescription show={false} />}
        />

        <Route path="/patient/:email" element={<PatientHistory />} />

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

        {/* 🧾 Patient Prescriptions */}
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PrescriptionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions/:id"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PrescriptionDetail />
            </ProtectedRoute>
          }
        />

        {/* 🧾 Patient Lab Reports */}
        <Route
          path="/patient/lab-reports"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <LabReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/lab-reports/:id"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <LabReportPreview />
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

        {/* 🔹 NEW: View Lab Report Route */}
        <Route
          path="/labtech/view-report/:reportId"
          element={
            <ProtectedRoute requiredRole="LABTECH">
              <ViewLabReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}





export default App;
