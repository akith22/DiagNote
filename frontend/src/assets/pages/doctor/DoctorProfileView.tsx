import React from "react";
import type { DoctorProfile } from "../../../types";

interface DoctorProfileViewProps {
  profile: DoctorProfile;
  onEdit: () => void;
}

const DoctorProfileView: React.FC<DoctorProfileViewProps> = ({
  profile,
  onEdit,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Professional Details</h2>
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Specialization
          </label>
          <p className="mt-1 text-sm text-gray-900">{profile.specialization}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Number
          </label>
          <p className="mt-1 text-sm text-gray-900">{profile.licenseNumber}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Available Times
          </label>
          <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
            {profile.availableTimes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileView;
