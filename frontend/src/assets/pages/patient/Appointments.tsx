import React, { useState, useEffect } from "react";
import { appointmentService } from "../../../services/AppointmentsService";
import type { AppointmentResponse } from "../../../types/types";
import { FiTrash2, FiClock } from "react-icons/fi";

interface Props {
  patientEmail: string;
}

const Appointments: React.FC<Props> = ({ patientEmail }) => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [doctorEmail, setDoctorEmail] = useState<string | null>(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await appointmentService.getPatientAppointments(patientEmail);
      setAppointments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!doctorEmail || !appointmentDateTime) {
      setError("Please select a doctor and appointment time");
      return;
    }
    try {
      setError("");
      setSuccess("");
      await appointmentService.bookAppointment({
        doctorEmail,
        patientEmail,
        appointmentDateTime,
      });
      setSuccess("Appointment booked successfully");
      setDoctorEmail(null);
      setAppointmentDateTime("");
      fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to book appointment");
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.cancelAppointment(id);
        setSuccess("Appointment cancelled");
        fetchAppointments();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to cancel appointment");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Appointments</h2>

      {/* Book Appointment Form */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-sm">
        <h3 className="font-bold mb-2">Book a Doctor</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="string"
            placeholder="Doctor ID"
            value={doctorEmail || ""}
            onChange={(e) => setDoctorEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-1"
          />
          <input
            type="datetime-local"
            value={appointmentDateTime}
            onChange={(e) => setAppointmentDateTime(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-1"
          />
          <button
            onClick={handleBookAppointment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
          >
            Book
          </button>
        </div>
      </div>

      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Appointments List */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.appointmentId}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
            >
              <div>
                <p className="font-medium">Doctor Name: {appt.doctorName}</p>
                <p className="text-gray-600 flex items-center">
                  <FiClock className="mr-1" />
                  {new Date(appt.appointmentDateTime).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleCancel(appt.appointmentId)}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <FiTrash2 className="mr-1" />
                Cancel
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
