import API from "./api";

export interface DoctorLabReportDto {
  id: number;
  labRequestId: number;
  reportFileName: string;
  createdAt: string;
}

export const doctorLabReportService = {
  getAllLabReports: async (): Promise<DoctorLabReportDto[]> => {
    const response = await API.get("/doctor/labreports");
    return response.data;
  },

  getLabReportByLabRequestId: async (labRequestId: number): Promise<DoctorLabReportDto> => {
    const response = await API.get(`/doctor/labreports/by-request/${labRequestId}`);
    return response.data;
  },

 openReportFile: async (fileName: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await API.get(`/doctor/labreports/files/${fileName}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Use content-type from headers if available
    const contentType = response.headers["content-type"] || "application/octet-stream";
    const blob = new Blob([response.data], { type: contentType });

    // Create an object URL
    const fileURL = window.URL.createObjectURL(blob);

    // Option 1: open in new tab (works for PDFs mostly)
    const newWindow = window.open(fileURL);
    if (!newWindow) throw new Error("Failed to open new tab");

    // Option 2: trigger download (safer for DOCX/XLSX)
    // const link = document.createElement("a");
    // link.href = fileURL;
    // link.setAttribute("download", fileName);
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // Clean up
    setTimeout(() => window.URL.revokeObjectURL(fileURL), 1000);
  } catch (error) {
    console.error("Failed to open lab report file:", error);
  }
}

};
