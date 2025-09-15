import React from "react";
import type { LabTechProfile } from "../../../types";

interface LabTechProfileViewProps {
  profile: LabTechProfile;
  onEdit: () => void;
  onDelete: () => void;
}

const LabTechProfileView: React.FC<LabTechProfileViewProps> = ({
  profile,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Department Details</h2>
        <div className="space-x-2">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <p className="mt-1 text-sm text-gray-900">{profile.department}</p>
        </div>
      </div>
    </div>
  );
};

export default LabTechProfileView;
