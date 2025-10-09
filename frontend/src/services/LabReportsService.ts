import api from "./api";

export const labReportsService = {
  uploadReport: async (file: File, labTechId: number, labRequestId: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("labTechId", labTechId.toString());
    formData.append("labRequestId", labRequestId.toString());

    const response = await api.post("/lab-reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
