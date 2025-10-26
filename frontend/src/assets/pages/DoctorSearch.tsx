import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { appointmentService } from "../../services/AppointmentsService";
import API from "../../services/api";
import { getUser } from "../../api/auth";
import DateTimePicker from "../../components/common/DateTimeCalender";

interface Doctor {
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  availableTimes: string;
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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

  const handleSearch = async () => {
    if (!search.trim() && !specializationFilter) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("name", search);
      if (specializationFilter)
        params.append("specialization", specializationFilter);

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

  function toISOStringNoShift(dateStr: string) {
    const [datePart, timePart] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    return date.toISOString();
  }

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
      const iso = toISOStringNoShift(selectedDate);

      await appointmentService.bookAppointment({
        doctorEmail: selectedDoctor.email,
        patientEmail: user.email,
        appointmentDateTime: iso,
      });

      setSuccess("Appointment booked successfully");
      window.location.href = "/patient/dashboard";
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Box */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-white/60 p-8 mb-8 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6 flex items-center">
            <svg
              className="w-8 h-8 mr-3 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            Find Your Perfect Doctor
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter doctor name or specialty"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="relative">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSearch}
              disabled={loading || (!search.trim() && !specializationFilter)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Search Doctors
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-8 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-white/60 overflow-hidden transition-all duration-300">
            <div className="px-8 py-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Available Doctors {results.length > 0 && `(${results.length})`}
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.length > 0 ? (
                results.map((doctor, idx) => (
                  <div
                    key={idx}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/40 hover:shadow-lg hover:border-blue-200/60 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {doctor.name}
                        </h3>
                        <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium rounded-full">
                          {doctor.specialization}
                        </span>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">DR</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {doctor.email}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        License: {doctor.licenseNumber}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Available: {doctor.availableTimes}
                      </div>
                    </div>

                    <button
                      onClick={() => openBookingModal(doctor)}
                      className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Book Appointment
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showModal && selectedDoctor && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Blurred Background */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"></div>

            {/* Modal Content */}
            <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/60 p-8 w-full max-w-2xl mx-4 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    Book Appointment
                  </h2>
                  <p className="text-gray-600 mt-1">
                    with Dr. {selectedDoctor.name}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {selectedDoctor.specialization}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Feedback */}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-800 font-medium">{success}</span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              )}

              {/* Date Time Picker Section */}
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/60 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Select Date & Time
                </h3>

                {/* Enhanced Calendar Styling */}
                <div className="mb-6">
                  <style>
                    {`
                      .enhanced-calendar {
                        background: white;
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 16px;
                        padding: 20px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                        backdrop-filter: blur(10px);
                      }

                      .enhanced-calendar .react-calendar__navigation {
                        display: flex;
                        height: 44px;
                        margin-bottom: 1em;
                        background: linear-gradient(135deg, #3b82f6, #6366f1);
                        border-radius: 12px;
                        padding: 4px;
                      }

                      .enhanced-calendar .react-calendar__navigation button {
                        min-width: 44px;
                        background: transparent;
                        color: white;
                        font-weight: 600;
                        border-radius: 8px;
                        transition: all 0.2s ease;
                      }

                      .enhanced-calendar .react-calendar__navigation button:hover {
                        background: rgba(255, 255, 255, 0.2);
                      }

                      .enhanced-calendar .react-calendar__navigation button:disabled {
                        background: rgba(255, 255, 255, 0.1);
                        color: rgba(255, 255, 255, 0.7);
                      }

                      .enhanced-calendar .react-calendar__month-view__weekdays {
                        text-align: center;
                        text-transform: uppercase;
                        font-weight: 600;
                        font-size: 0.75em;
                        color: #6b7280;
                        margin-bottom: 8px;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 8px;
                      }

                      .enhanced-calendar .react-calendar__month-view__weekdays__weekday {
                        padding: 8px 0;
                      }

                      .enhanced-calendar .react-calendar__month-view__weekdays__weekday abbr {
                        text-decoration: none;
                      }

                      .enhanced-calendar .react-calendar__tile {
                        max-width: 100%;
                        padding: 12px 6.6667px;
                        background: transparent;
                        text-align: center;
                        border-radius: 12px;
                        transition: all 0.2s ease;
                        font-weight: 500;
                        color: #374151;
                        position: relative;
                        overflow: hidden;
                      }

                      .enhanced-calendar .react-calendar__tile:enabled:hover,
                      .enhanced-calendar .react-calendar__tile:enabled:focus {
                        background: linear-gradient(135deg, #3b82f6, #6366f1);
                        color: white;
                        transform: scale(1.05);
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                      }

                      .enhanced-calendar .react-calendar__tile--now {
                        background: linear-gradient(135deg, #10b981, #34d399);
                        color: white;
                        font-weight: 600;
                        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                      }

                      .enhanced-calendar .react-calendar__tile--now:enabled:hover,
                      .enhanced-calendar .react-calendar__tile--now:enabled:focus {
                        background: linear-gradient(135deg, #059669, #10b981);
                        transform: scale(1.05);
                      }

                      .enhanced-calendar .react-calendar__tile--active {
                        background: linear-gradient(135deg, #8b5cf6, #a855f7);
                        color: white;
                        font-weight: 600;
                        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                      }

                      .enhanced-calendar .react-calendar__tile--active:enabled:hover,
                      .enhanced-calendar .react-calendar__tile--active:enabled:focus {
                        background: linear-gradient(135deg, #7c3aed, #8b5cf6);
                        transform: scale(1.05);
                      }

                      .enhanced-calendar .react-calendar__tile--hasActive {
                        background: linear-gradient(135deg, #60a5fa, #3b82f6);
                        color: white;
                      }

                      .enhanced-calendar .react-calendar__year-view__months,
                      .enhanced-calendar .react-calendar__decade-view__years,
                      .enhanced-calendar .react-calendar__century-view__decades {
                        border-radius: 12px;
                      }

                      .enhanced-calendar .react-calendar__tile--range {
                        background: linear-gradient(135deg, #93c5fd, #60a5fa);
                        color: white;
                      }

                      .enhanced-calendar .react-calendar__tile--rangeStart,
                      .enhanced-calendar .react-calendar__tile--rangeEnd {
                        background: linear-gradient(135deg, #3b82f6, #6366f1);
                        color: white;
                      }

                      /* Weekend styling */
                      .enhanced-calendar .react-calendar__month-view__days__day--weekend {
                        color: #dc2626;
                      }

                      .enhanced-calendar .react-calendar__month-view__days__day--neighboringMonth {
                        color: #9ca3af;
                        opacity: 0.5;
                      }

                      /* Time picker enhancements */
                      .time-picker-container {
                        background: white;
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 16px;
                        padding: 20px;
                        margin-top: 16px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                      }

                      .time-slot {
                        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
                        border: 2px solid transparent;
                        border-radius: 12px;
                        padding: 12px 16px;
                        margin: 4px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-weight: 500;
                        color: #374151;
                      }

                      .time-slot:hover {
                        background: linear-gradient(135deg, #3b82f6, #6366f1);
                        color: white;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                      }

                      .time-slot.selected {
                        background: linear-gradient(135deg, #10b981, #34d399);
                        color: white;
                        border-color: #059669;
                        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                      }
                    `}
                  </style>

                  <DateTimePicker
                    availableTimes={selectedDoctor.availableTimes
                      .split(",")
                      .map((item) => item.trim().replace(/^"|"$/g, ""))}
                    onChange={(date) => setSelectedDate(date)}
                  />
                </div>

                {selectedDate && (
                  <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-200/60">
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selected appointment time:
                      <span className="font-medium text-green-700 ml-1">
                        {selectedDate}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || booking}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center"
                >
                  {booking ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Booking...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Confirm Appointment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
