// src/services/PrescriptionService.ts
import type { Prescription } from "../types";
import API from "./api";

export const prescriptionService = {
  async getPatientPrescriptions(): Promise<Prescription[]> {
    try {
      const response = await API.get("/patient/prescriptions");
      console.log("Prescription data received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Prescription fetch error:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch prescriptions");
    }
  },
};

