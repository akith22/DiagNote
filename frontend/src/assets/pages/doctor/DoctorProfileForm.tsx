import React, { useState, useEffect } from "react";
import type { DoctorDetails } from "../../../types";

interface DoctorProfileFormProps {
  initialData?: DoctorDetails;
  onSubmit: (data: DoctorDetails) => void;
  isEditing?: boolean;
}

interface AvailableTime {
  date: string;
  startTime: string;
  endTime: string;
}

const DoctorProfileForm: React.FC<DoctorProfileFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<DoctorDetails>({
    specialization: "",
    licenseNumber: "",
    availableTimes: "",
  });

  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [newTime, setNewTime] = useState<AvailableTime>({
    date: "",
    startTime: "",
    endTime: "",
  });

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      // parse existing availableTimes string into array
      if (initialData.availableTimes) {
        const parsed = initialData.availableTimes.split(",").map((slot) => {
          // slot example: "Monday 08:00-18:00"
          const match = slot
            .trim()
            .match(/^([A-Za-z]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
          return match
            ? { date: match[1], startTime: match[2], endTime: match[3] }
            : { date: "", startTime: "", endTime: "" };
        });
        setAvailableTimes(parsed);
      }
    }
  }, [initialData]);

  // Handle profile field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add availability
  const handleAddTime = () => {
    if (!newTime.date || !newTime.startTime || !newTime.endTime) return;
    setAvailableTimes((prev) => [...prev, newTime]);
    setNewTime({ date: "", startTime: "", endTime: "" });
  };

  // Delete availability
  const handleDeleteTime = (index: number) => {
    setAvailableTimes((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit profile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // convert availableTimes array to simple string list
    const availableTimesStr = availableTimes
      .map((t) => `${t.date} ${t.startTime}-${t.endTime}`)
      .join(", ");

    onSubmit({
      ...formData,
      availableTimes: availableTimesStr,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Professional Details" : "Complete Your Profile"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Specialization */}
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-700"
          >
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {/* License Number */}
        <div>
          <label
            htmlFor="licenseNumber"
            className="block text-sm font-medium text-gray-700"
          >
            License Number
          </label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Available Times */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Times
          </label>

          {/* Add new availability */}
          <div className="flex gap-2 mb-4">
            <select
              value={newTime.date}
              onChange={(e) =>
                setNewTime((prev) => ({ ...prev, date: e.target.value }))
              }
              className="border px-2 py-1 rounded"
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <input
              type="time"
              value={newTime.startTime}
              onChange={(e) =>
                setNewTime((prev) => ({ ...prev, startTime: e.target.value }))
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="time"
              value={newTime.endTime}
              onChange={(e) =>
                setNewTime((prev) => ({ ...prev, endTime: e.target.value }))
              }
              className="border px-2 py-1 rounded"
            />
            <button
              type="button"
              onClick={handleAddTime}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>

          {/* Show existing availability (stacked) */}
          <ul className="space-y-2">
            {availableTimes.map((t, index) => (
              <li
                key={index}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>
                  {t.date} — {t.startTime} to {t.endTime}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteTime(index)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {isEditing ? "Update Profile" : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfileForm;
