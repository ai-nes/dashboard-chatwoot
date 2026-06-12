import type { ApiResponse } from "@/types/api";
import apiService from "../core";
import type { ApiStudentDashboardData } from "@/app/(dashboard)/components/student-types";

export interface FrappeResponse<T> {
  message: T;
}

export interface GetStudentDashboardParams {
  phone: string;
  interactionLimit?: number;
  suggestedEventLimit?: number;
}

export const studentService = {
  getStudentDashboard: async (params: GetStudentDashboardParams): Promise<ApiStudentDashboardData> => {
    const response = await apiService.get<FrappeResponse<ApiResponse<ApiStudentDashboardData>>>(
      "api/method/crm.api.get_student_dashboard",
      params
    );
    
    const envelope = response.data?.message;
    if (!envelope) {
      throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ");
    }
    
    if (!envelope.isSuccess) {
      throw new Error(envelope.message || "Không lấy được dữ liệu học sinh");
    }
    
    return envelope.data;
  },
};
