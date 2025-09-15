import React from "react";
import type { User } from "../../types";

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <p className="mt-1 text-sm text-gray-900 capitalize">
            {user.role.toLowerCase()}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.userId}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
