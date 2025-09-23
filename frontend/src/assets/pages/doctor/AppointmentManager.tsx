import React, { useEffect, useMemo, useState } from "react";
import {
  FiClock,
  FiUser,
  FiCheck,
  FiX,
  FiSearch,
  FiHash,
  FiCalendar,
} from "react-icons/fi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { doctorAppointmentService } from "../../../services/DoctorAppointmenrService";
import type { AppointmentDto } from "../../../services/DoctorAppointmenrService";

const TABS = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "ACCEPTED", label: "Accepted" },
  { id: "DECLINED", label: "Declined" },
];

const normalizeStatus = (status?: string) => {
  if (!status) return status;
  const s = String(status).trim().toUpperCase();
  switch (s) {
    case "CONFIRMED":
    case "CONFIRMED_V2":
      return "ACCEPTED";
    case "REJECTED":
    case "CANCELLED":
    case "CANCELED":
    case "DECLINED":
      return "DECLINED";
    default:
      return s;
  }
};

const AppointmentManager: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("PENDING");
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>(
    {}
  );
  const [query, setQuery] = useState("");

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await doctorAppointmentService.getAppointments();
      setAppointments(
        (data || []).map((a: any) => ({
          ...a,
          status: normalizeStatus(a.status),
        }))
      );
    } catch (err: any) {
      console.error("fetchAllAppointments error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const setActionFlag = (id: number, value: boolean) =>
    setActionLoading((prev) => ({ ...prev, [id]: value }));

  const unwrapServiceResult = (res: any) => {
    if (!res) return null;
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res;
  };

  const applyUpdatedAppointment = (updatedRaw: any) => {
    if (!updatedRaw) return false;
    const updated = {
      ...updatedRaw,
      status: normalizeStatus(updatedRaw.status),
    };
    if (typeof updated.id === "undefined" || updated.id === null) return false;
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    return true;
  };

  const handleAccept = async (id: number) => {
    try {
      setError("");
      setActionFlag(id, true);
      const res = await doctorAppointmentService.acceptAppointment(id);
      const unwrapped = unwrapServiceResult(res);

      const applied = applyUpdatedAppointment(unwrapped);
      if (!applied) {
        await fetchAllAppointments();
      }
      setActiveTab("ACCEPTED");
    } catch (err: any) {
      console.error("handleAccept error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to accept appointment"
      );
    } finally {
      setActionFlag(id, false);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      setError("");
      setActionFlag(id, true);
      const res = await doctorAppointmentService.declineAppointment(id);
      const unwrapped = unwrapServiceResult(res);

      const applied = applyUpdatedAppointment(unwrapped);
      if (!applied) {
        await fetchAllAppointments();
      }
      setActiveTab("DECLINED");
    } catch (err: any) {
      console.error("handleDecline error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to decline appointment"
      );
    } finally {
      setActionFlag(id, false);
    }
  };

  // FIXED: cancel now uses decline endpoint (to avoid 403)
  const handleCancel = async (id: number) => {
    try {
      setError("");
      setActionFlag(id, true);
      const res = await doctorAppointmentService.declineAppointment(id);
      const unwrapped = unwrapServiceResult(res);

      const applied = applyUpdatedAppointment(unwrapped);
      if (!applied) {
        await fetchAllAppointments();
      }
      setActiveTab("DECLINED");
    } catch (err: any) {
      console.error("handleCancel error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel appointment"
      );
    } finally {
      setActionFlag(id, false);
    }
  };

  const displayedAppointments = useMemo(() => {
    const byTab =
      activeTab === "ALL"
        ? appointments
        : appointments.filter((a) => a.status === activeTab);
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((a) =>
      `${a.patientName ?? ""} ${a.patientId ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [appointments, activeTab, query]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 md:p-8">
      <header className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Appointments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track patient appointments
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient name or ID..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-64"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6 border border-gray-100">
        <div className="flex overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-4 font-medium flex items-center transition-all duration-300 whitespace-nowrap ${
                activeTab === t.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">
                {
                  appointments.filter((a) =>
                    t.id === "ALL" ? true : a.status === t.id
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FiX className="h-5 w-5 text-red-500" />
            <span className="ml-3 text-sm text-red-700">{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Appointment list */}
      <div className="grid gap-4">
        {displayedAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
            <FiCalendar className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-lg">No appointments found</p>
            <p className="text-sm mt-1">
              {query
                ? "Try adjusting your search terms"
                : `No ${activeTab.toLowerCase()} appointments`}
            </p>
          </div>
        ) : (
          displayedAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center">
                      <FiUser className="mr-2 text-blue-600" />{" "}
                      {appt.patientName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FiHash className="mr-1" /> ID: {appt.patientId}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="mr-1" /> {appt.appointmentTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block text-xs font-medium py-1 px-3 rounded-full uppercase tracking-wide ${
                        appt.status === "PENDING"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : appt.status === "ACCEPTED"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {appt.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleAccept(appt.id)}
                        disabled={!!actionLoading[appt.id]}
                        className={`flex items-center py-2 px-4 rounded-xl shadow-sm transition-all duration-200 ${
                          actionLoading[appt.id]
                            ? "bg-green-300 text-white cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        <FiCheck className="mr-2" />
                        {actionLoading[appt.id] ? "Accepting..." : "Accept"}
                      </button>

                      <button
                        onClick={() => handleDecline(appt.id)}
                        disabled={!!actionLoading[appt.id]}
                        className={`flex items-center py-2 px-4 rounded-xl shadow-sm transition-all duration-200 ${
                          actionLoading[appt.id]
                            ? "bg-red-300 text-white cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        <FiX className="mr-2" />
                        {actionLoading[appt.id] ? "Declining..." : "Decline"}
                      </button>
                    </>
                  ) : appt.status === "ACCEPTED" ? (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      disabled={!!actionLoading[appt.id]}
                      className={`flex items-center py-2 px-4 rounded-xl shadow-sm transition-all duration-200 ${
                        actionLoading[appt.id]
                          ? "bg-yellow-300 text-white cursor-not-allowed"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      <FiX className="mr-2" />
                      {actionLoading[appt.id] ? "Cancelling..." : "Cancel"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccept(appt.id)}
                      disabled={!!actionLoading[appt.id]}
                      className={`flex items-center py-2 px-4 rounded-xl shadow-sm transition-all duration-200 ${
                        actionLoading[appt.id]
                          ? "bg-green-300 text-white cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <FiCheck className="mr-2" />
                      {actionLoading[appt.id]
                        ? "Accepting..."
                        : "Accept Again"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentManager;
