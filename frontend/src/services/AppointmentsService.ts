import axios from "axios";
import type { AppointmentRequest, AppointmentResponse } from "../types";
import API from "./api";



export const appointmentService = {
  getDoctorAppointments: async (
    doctorId: number
  ): Promise<AppointmentResponse[]> => {
    const res = await API.get(`/appointments/doctor/${doctorId}`);
    return res.data;
  },

  getPatientAppointments: async (
    patientEmail: string
  ): Promise<AppointmentResponse[]> => {
    const res = await API.get(`appointments/patient/${patientEmail}`);
    return res.data;
  },

  bookAppointment: async (
    data: AppointmentRequest
  ): Promise<AppointmentResponse> => {
    const res = await API.post('appointments', data);
    return res.data;
  },

  cancelAppointment: async (appointmentId: number) => {
    await API.delete(`appointments/${appointmentId}`);
  },

  rescheduleAppointment: async (appointmentId: number, dateTime: string) => {
    const res = await API.put(`appointments/${appointmentId}/reschedule`, {
      appointmentDateTime: dateTime,
    });
    return res.data;
  },
};
