import React from "react";
import type { PatientProfile } from "../../../types";

interface PatientProfileViewProps {
  profile: PatientProfile;
  onEdit: () => void;
  onDelete: () => void;
}

const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  profile,
  onEdit,
  onDelete,
}) => {
  // Helper function to display "Not provided" for empty values
  const displayValue = (
    value: string | number | null | undefined,
    suffix: string = ""
  ): string => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }
    return `${value}${suffix}`;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Personal Details
        </h2>
        <div className="flex space-x-2">
          {/* <button
            onClick={onEdit}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Edit personal details"
          >
            <svg
              className="w-4 h-4 mr-1 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button> */}
          <button
            onClick={onDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Delete personal details"
          >
            <svg
              className="w-4 h-4 mr-1 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Gender
          </label>
          <p className="text-sm text-gray-900 font-medium">
            {displayValue(profile.gender)}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Age
          </label>
          <p className="text-sm text-gray-900 font-medium">
            {displayValue(profile.age, " years")}
          </p>
        </div>

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Address
          </label>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">
            {displayValue(profile.address)}
          </p>
        </div>
      </div>

      {/* Additional information section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Profile Status
        </h3>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              profile.profileComplete ? "bg-green-500" : "bg-yellow-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {profile.profileComplete
              ? "Profile complete"
              : "Profile incomplete - Please add your details"}
          </span>
        </div>
      </div>

      {/* Help text */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> Your personal details help healthcare providers
          deliver better care. Please ensure your information is accurate and
          up-to-date.
        </p>
      </div>
    </div>
  );
};

export default PatientProfileView;
