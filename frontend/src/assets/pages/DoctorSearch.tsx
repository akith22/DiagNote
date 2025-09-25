import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { appointmentService } from "../../services/AppointmentsService";
import API from "../../services/api";
import { getUser } from "../../api/auth"; // <-- import getUser

interface Doctor {
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  availableTimes: string; // e.g., "2025-09-25 7:00am - 8:00pm , 2025-09-30 7:00am - 8:00pm"
}

export default function DoctorSearch() {
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [results, setResults] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Booking modal states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [booking, setBooking] = useState(false);

  // Feedback messages
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
  ];

  // Parse availableTimes to an array of date strings
  const parseAvailableDates = (availableTimes: string): string[] => {
    if (!availableTimes) return [];
    return availableTimes
      .split(",")
      .map((entry) => entry.trim().split(" ")[0])
      .map((d) => new Date(d).toDateString());
  };

  const handleSearch = async () => {
    if (!search.trim() && !specializationFilter) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("name", search);
      if (specializationFilter) params.append("specialization", specializationFilter);

      const res = await API.get<Doctor[]>(`/doctors?${params.toString()}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      alert("Failed to fetch doctors. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearch("");
    setSpecializationFilter("");
    setResults([]);
    setHasSearched(false);
    setSuccess("");
    setError("");
  };

  const openBookingModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setSelectedDate(null);
    setSuccess("");
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSuccess("");
    setError("");
  };

  // ✅ Updated booking functionality using appointmentService and getUser()
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate) {
      setError("Please select a doctor and appointment date");
      return;
    }

    const user = getUser();
    if (!user) {
      setError("You must be logged in to book an appointment.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      // ✅ Capture real current time in IST
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms
      const istNow = new Date(now.getTime() + istOffset - now.getTimezoneOffset() * 60000);

      // ✅ Merge selected date with IST current time
      const appointmentDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        istNow.getHours(),
        istNow.getMinutes(),
        istNow.getSeconds()
      ).toISOString();

      await appointmentService.bookAppointment({
        doctorEmail: selectedDoctor.email,
        patientEmail: user.email, // logged-in user email
        appointmentDateTime,
      });

      setSuccess("Appointment booked successfully");
      closeModal();
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Box */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            Search Doctors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              placeholder="Enter doctor name or specialty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSearch}
              disabled={loading || (!search.trim() && !specializationFilter)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Searching..." : "Search Doctors"}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="bg-white shadow-sm rounded-xl border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Results {results.length > 0 && `(${results.length})`}
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((doctor, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-5 border hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-blue-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-600">{doctor.email}</p>
                  <p className="text-sm text-gray-600">
                    License: {doctor.licenseNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Available: {doctor.availableTimes}
                  </p>
                  <button
                    onClick={() => openBookingModal(doctor)}
                    className="mt-4 w-full px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showModal && selectedDoctor && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                Book with {selectedDoctor.name}
              </h2>

              {/* Feedback */}
              {success && <p className="text-green-600 mb-2">{success}</p>}
              {error && <p className="text-red-600 mb-2">{error}</p>}

              <p className="mb-2 text-gray-600">
                Available dates are shown in{" "}
                <span className="text-green-600 font-medium">green</span>
              </p>

              <Calendar
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                tileDisabled={({ date }) => {
                  const availableDates = parseAvailableDates(selectedDoctor.availableTimes);
                  return !availableDates.includes(date.toDateString());
                }}
                tileClassName={({ date }) => {
                  const availableDates = parseAvailableDates(selectedDoctor.availableTimes);
                  return availableDates.includes(date.toDateString())
                    ? "bg-green-200 text-green-800 rounded-full"
                    : "";
                }}
              />

              {selectedDate && (
                <p className="mt-3 text-sm">
                  Selected: <span className="font-medium">{selectedDate.toDateString()}</span>
                </p>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || booking}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {booking ? "Booking..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
