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
              className="flex justify-between items-center p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-lg text-gray-800">Dr. {appt.doctorName}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 flex items-center">
                  <FiClock className="mr-2 text-gray-400" />
                  {new Date(appt.appointmentDateTime).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => handleCancel(appt.appointmentId)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                disabled={appt.status === 'cancelled'}
              >
                <FiTrash2 className="text-base" />
                {appt.status === 'cancelled' ? 'Cancelled' : 'Cancel'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
